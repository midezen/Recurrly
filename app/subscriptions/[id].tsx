import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SubDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>SubDetails : {id}</Text>
      <Link href="/">Go back</Link>
    </View>
  );
};

export default SubDetails;
