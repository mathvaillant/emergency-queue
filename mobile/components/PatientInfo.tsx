import { PatientQueueData, TagColors } from "@/types";
import { Text, View } from "tamagui";

export function PatientInfo({ patient }: { patient: PatientQueueData; }) {
  return (
    <View
      w="90%"
      p={20}
      gap={20}
      bg="white"
      br={20}
      shac="black"
      shof={{ width: 0, height: 0 }}
      shop={0.25}
      shar={3.84}
    >
      <Text ta='center' fow='bold' fos={20}>
        📌 Your Triage Information 📌
      </Text>

      <View fd='row' jc='space-between' gap={10}>
        <View w='20%' ai='center' jc='center' p={10} bg='black' br={50}>
          <Text fos={26} color='white' fow='bold'>
            #{patient.number}
          </Text>
        </View>

        <View
          w='70%'
          ai='center'
          jc='center'
          bg={`$${TagColors[patient.assignedLabel]}8`}
          br={50}
        >
          <Text fos={26} fow='bold'>
            {patient.assignedLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}
