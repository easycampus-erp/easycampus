import { Text, View } from "react-native";

export function ListScreen({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={{ backgroundColor: "white", borderRadius: 24, padding: 18 }}>
      <Text style={{ color: "#152033", fontSize: 20, fontWeight: "700" }}>{title}</Text>
      {items.map((item) => (
        <Text key={item} style={{ color: "#5e6b82", marginTop: 8 }}>{`\u2022 ${item}`}</Text>
      ))}
    </View>
  );
}
