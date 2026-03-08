import { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { DashboardScreen } from "./src/screens/dashboard-screen";
import { ListScreen } from "./src/screens/list-screen";
import { mobileNavigation, type MobileSection } from "./src/navigation/tabs";

declare const process: {
  env: Record<string, string | undefined>;
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

type DashboardState = {
  studentName: string;
  attendance: string;
  gpa: string;
  announcements: string[];
  timetable: string[];
  attendanceRecords: string[];
  markRecords: string[];
  notifications: string[];
  mentorMessages: string[];
};

const fallbackState: DashboardState = {
  studentName: "EasyCampus Student",
  attendance: "Connect Supabase",
  gpa: "Connect Supabase",
  announcements: ["Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to load live data."],
  timetable: ["Live timetable loads after a valid student login."],
  attendanceRecords: ["Attendance detail appears here after login."],
  markRecords: ["Marks analytics appear here after login."],
  notifications: ["Notifications appear here after login."],
  mentorMessages: ["Mentor messages are available after mentor workflows are populated."]
};

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionEmail, setSessionEmail] = useState("");
  const [data, setData] = useState<DashboardState>(fallbackState);
  const [activeSection, setActiveSection] = useState<MobileSection>("Dashboard");

  const isConfigured = useMemo(() => Boolean(supabase), []);

  async function registerPushToken(userId: string) {
    if (!supabase || !Device.isDevice) return;

    const permission = await Notifications.getPermissionsAsync();
    let finalStatus = permission.status;

    if (finalStatus !== "granted") {
      const nextPermission = await Notifications.requestPermissionsAsync();
      finalStatus = nextPermission.status;
    }

    if (finalStatus !== "granted") {
      return;
    }

    const membership = await supabase.from("memberships").select("institution_id").eq("profile_id", userId).single();
    if (!membership.data?.institution_id) {
      return;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const token = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);

    await supabase.from("device_push_tokens").upsert(
      {
        institution_id: membership.data.institution_id,
        profile_id: userId,
        token: token.data,
        platform: Device.osName?.toLowerCase() ?? "expo",
        active: true,
        last_seen_at: new Date().toISOString()
      },
      { onConflict: "token" }
    );
  }

  async function loadDashboard() {
    if (!supabase) {
      setData(fallbackState);
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setSessionEmail("");
      return;
    }

    setSessionEmail(user.email ?? "");
    await registerPushToken(user.id);

    const [{ data: profile }, { data: student }, { data: marks }, { data: announcements }, { data: timetable }, { data: notifications }, { data: meetings }] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).single(),
      supabase.from("students").select("id, course_id, current_semester, section").eq("profile_id", user.id).single(),
      supabase.from("marks").select("marks_obtained, exams(max_marks)").eq("student_id", (await supabase.from("students").select("id").eq("profile_id", user.id).single()).data?.id ?? ""),
      supabase.from("announcements").select("title").order("created_at", { ascending: false }).limit(3),
      supabase
        .from("timetable_entries")
        .select("start_time, end_time, subjects(name, code)")
        .eq("course_id", (await supabase.from("students").select("course_id").eq("profile_id", user.id).single()).data?.course_id ?? "")
        .eq("semester_no", (await supabase.from("students").select("current_semester").eq("profile_id", user.id).single()).data?.current_semester ?? 0)
        .eq("section", (await supabase.from("students").select("section").eq("profile_id", user.id).single()).data?.section ?? "")
        .order("day_of_week", { ascending: true })
        .limit(3),
      supabase.from("notifications").select("title, body, recipient_role").order("created_at", { ascending: false }).limit(5),
      supabase.from("mentor_meetings").select("meeting_date, notes, outcome_notes").eq("student_id", (await supabase.from("students").select("id").eq("profile_id", user.id).single()).data?.id ?? "").order("meeting_date", { ascending: false }).limit(5)
    ]);

    const markRows = marks ?? [];
    const avgScore =
      markRows.length > 0
        ? Math.round(
            markRows.reduce((sum, row) => {
              const exam = Array.isArray(row.exams) ? row.exams[0] : row.exams;
              const maxMarks = Number(exam?.max_marks ?? 0);
              return sum + (maxMarks > 0 ? (Number(row.marks_obtained) / maxMarks) * 100 : 0);
            }, 0) / markRows.length
          )
        : 0;

    const attendance = student?.id
      ? await supabase.from("attendance_records").select("status").eq("student_id", student.id)
      : { data: [] as Array<{ status: string }> };

    const records = attendance.data ?? [];
    const present = records.filter((record) => record.status === "present").length;
    const attendanceRate = records.length > 0 ? `${Math.round((present / records.length) * 100)}%` : "N/A";

    setData({
      studentName: profile?.full_name ?? "Student",
      attendance: attendanceRate,
      gpa: avgScore > 0 ? `${avgScore}% avg` : "N/A",
      announcements: (announcements ?? []).map((item) => item.title),
      timetable: (timetable ?? []).map((item) => {
        const subject = Array.isArray(item.subjects) ? item.subjects[0] : item.subjects;
        return `${subject?.code ?? "SUB"} ${item.start_time}-${item.end_time}`;
      }),
      attendanceRecords: records.map((record, index) => `Session ${index + 1}: ${record.status}`),
      markRecords: markRows.map((row, index) => `Assessment ${index + 1}: ${row.marks_obtained}`),
      notifications: (notifications ?? []).map((item) => `${item.title}: ${item.body}`),
      mentorMessages: (meetings ?? []).length > 0 ? (meetings ?? []).map((item) => `${item.meeting_date}: ${item.outcome_notes || item.notes || "Mentor follow-up logged."}`) : ["Mentor follow-up workflows can now be surfaced here from mentor meeting records."]
    });
  }

  useEffect(() => {
    if (!supabase) return;

    loadDashboard().catch(() => undefined);
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      loadDashboard().catch(() => undefined);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn() {
    if (!supabase) {
      Alert.alert("Missing config", "Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert("Sign in failed", error.message);
      return;
    }

    await loadDashboard();
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSessionEmail("");
    setData(fallbackState);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f7fb" }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={{ backgroundColor: "#0f6fff", borderRadius: 28, padding: 20 }}>
          <Text style={{ color: "#dbeafe", fontSize: 14 }}>EasyCampus Student App</Text>
          <Text style={{ color: "white", fontSize: 28, fontWeight: "700", marginTop: 8 }}>{sessionEmail ? `Welcome back, ${data.studentName}` : "Student Mobile Access"}</Text>
          <Text style={{ color: "#dbeafe", marginTop: 8 }}>
            {isConfigured ? "Sign in with a student account to load live attendance, marks, announcements, and timetable data." : "Connect Expo to Supabase environment variables to enable live mobile data."}
          </Text>
        </View>

        <View style={{ backgroundColor: "white", borderRadius: 24, padding: 18, gap: 12 }}>
          <Text style={{ color: "#152033", fontSize: 20, fontWeight: "700" }}>Sign In</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" style={inputStyle} />
          <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={inputStyle} />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable onPress={signIn} style={buttonPrimary}>
              <Text style={{ color: "white", fontWeight: "700" }}>{loading ? "Signing in..." : "Sign In"}</Text>
            </Pressable>
            <Pressable onPress={signOut} style={buttonSecondary}>
              <Text style={{ color: "#152033", fontWeight: "700" }}>Sign Out</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {mobileNavigation.map((section) => (
            <Pressable
              key={section}
              onPress={() => setActiveSection(section)}
              style={{
                backgroundColor: activeSection === section ? "#0f6fff" : "white",
                borderRadius: 999,
                paddingHorizontal: 16,
                paddingVertical: 10
              }}
            >
              <Text style={{ color: activeSection === section ? "white" : "#152033", fontWeight: "700" }}>{section}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {activeSection === "Dashboard" ? <DashboardScreen attendance={data.attendance} gpa={data.gpa} announcements={data.announcements} /> : null}
        {activeSection === "Attendance" ? <ListScreen title="Attendance Detail" items={data.attendanceRecords} /> : null}
        {activeSection === "Marks" ? <ListScreen title="Marks Analytics" items={data.markRecords} /> : null}
        {activeSection === "Timetable" ? <ListScreen title="Timetable" items={data.timetable} /> : null}
        {activeSection === "Assignments" ? <ListScreen title="Assignments" items={["Assignments uploaded from faculty workflows appear here."]} /> : null}
        {activeSection === "Notifications" ? <ListScreen title="Notifications" items={data.notifications} /> : null}
        {activeSection === "Mentor" ? <ListScreen title="Mentor Messages" items={data.mentorMessages} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "#d8e1ee",
  borderRadius: 999,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 15,
  color: "#152033"
} as const;

const buttonPrimary = {
  backgroundColor: "#0f6fff",
  borderRadius: 999,
  paddingHorizontal: 18,
  paddingVertical: 12
} as const;

const buttonSecondary = {
  backgroundColor: "#eef2f8",
  borderRadius: 999,
  paddingHorizontal: 18,
  paddingVertical: 12
} as const;
