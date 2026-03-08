import { Text, View } from "react-native";

export function DashboardScreen({ attendance, gpa, announcements }: { attendance: string; gpa: string; announcements: string[] }) {
  return (
    <>
      {[
        { title: "Attendance", value: attendance, helper: "Live from attendance records" },
        { title: "Marks", value: gpa, helper: "Live normalized score trend" }
      ].map((card) => (
        <View key={card.title} style={{ backgroundColor: "white", borderRadius: 24, padding: 18 }}>
          <Text style={{ color: "#5e6b82", fontSize: 14 }}>{card.title}</Text>
          <Text style={{ color: "#152033", fontSize: 24, fontWeight: "700", marginTop: 6 }}>{card.value}</Text>
          <Text style={{ color: "#5e6b82", marginTop: 4 }}>{card.helper}</Text>
        </View>
      ))}
      <ListCard title="Announcements" items={announcements} />
    </>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={{ backgroundColor: "white", borderRadius: 24, padding: 18 }}>
      <Text style={{ color: "#152033", fontSize: 20, fontWeight: "700" }}>{title}</Text>
      {items.map((item) => (
        <Text key={item} style={{ color: "#5e6b82", marginTop: 8 }}>{`\u2022 ${item}`}</Text>
      ))}
    </View>
  );
}
