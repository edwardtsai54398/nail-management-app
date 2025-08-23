import { View } from "react-native"
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from "react";
import useUserApi from "@/db/queries/users";

export default function Database(){
  const db = useSQLiteContext();
  const { getAllUsers } = useUserApi(db)
  useEffect(() => {
    getAllUsers()
  })
  return(
    <View></View>
  )
}