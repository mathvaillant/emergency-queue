import { LiveQueue } from "@/components/LiveQueue";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getQueue } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { View, Button } from "tamagui";
import { PatientQueueData } from "@/types";
import { PatientInfo } from "@/components/PatientInfo";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { Alert } from "react-native";

const pusher = new Pusher(process.env.EXPO_PUBLIC_PUSHER_KEY!, { cluster: "eu" });

export default function IndexScreen() {
  const queue = useQuery({ queryKey: ['queue'], queryFn: getQueue });
  const patient = useQuery({
    queryKey: ["patient"],
    queryFn: async () => AsyncStorage.getItem('patient')
      .then(data => data && JSON.parse(data) as PatientQueueData || null)
  });

  const patientMutation = useMutation({
    mutationKey: ['patient'],
    mutationFn: async () => AsyncStorage.removeItem('patient'),
    onSuccess: () => {
      queue.refetch();
      patient.refetch();
    }
  });

  function goToTriage() {
    router.push("/triage");
  }

  useEffect(() => {
    const channel = pusher.subscribe('live-queue');

    channel.bind('patient-in', (number: number) => {
      if (patient.data?.number !== number) queue.refetch();
    });

    channel.bind('patient-out', (number: number) => {
      if (patient.data?.number === number) {
        Alert.alert("It's your turn!", "Please proceed to the doctor's office.", [
          { text: "OK", onPress: () => patientMutation.mutate() }
        ]);
      } else {
        queue.refetch();
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [patient.data?.number]);

  useFocusEffect(() => {
    patient.refetch();
    queue.refetch();
  });

  return (
    <View
      ai="center"
      f={1}
      pt={20}
      gap={20}
      $theme-light={{ bg: "$red3" }}
      $theme-dark={{ bg: "$gray2Dark" }}
    >
      {patient.data ? (
        <PatientInfo patient={patient.data} />
      ) : (
        <Button
          onPress={goToTriage}
          size={"$5"}
          bg="$red10"
          br={50}
          my={20}
          w={"90%"}
          pressStyle={{ backgroundColor: "$red8" }}
          textProps={{ color: "white", fow: "bold", fos: 20 }}
        >
          ✚   START TRIAGE   ✚
        </Button>
      )}

      <LiveQueue
        data={queue.data}
        isLoading={queue.isLoading}
        refetch={queue.refetch}
      />
    </View>
  );
}
