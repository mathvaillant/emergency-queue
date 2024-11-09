import { Queue, TagColors } from "@/types";
import { FlatList } from "react-native";
import { Text, View } from "tamagui";

interface Props {
  data?: Queue;
  isLoading: boolean;
  refetch: () => void;
}

export function LiveQueue({ data, isLoading, refetch }: Props) {
  return (
    <View w="90%">
      <Text my={20} ta="center" fow="bold" fos={30}>
        🚨 Live Queue 🚨
      </Text>
      <FlatList
        onRefresh={refetch}
        refreshing={isLoading}
        data={data}
        keyExtractor={({ number }) => number.toString()}
        ListEmptyComponent={() => (
          <Text m={20} ta="center" fow={400} fos={20}>
            {isLoading ? "Loading..." : "There's currently no one in the queue"}
          </Text>
        )}
        ItemSeparatorComponent={() => <View h={15} />}
        style={{ width: "100%", marginBottom: 200 }}
        renderItem={({ item }) => (
          <View
            fd='row'
            p={16}
            als="center"
            jc="space-between"
            ai="center"
            w="100%"
            bg={`$${TagColors[item.assignedLabel]}8`}
            br={50}
            shac="black"
            shof={{ width: 0, height: 0 }}
            shop={0.25}
            shar={3.84}
          >
            <View
              bg={`$${TagColors[item.assignedLabel]}4`}
              br={50}
              px={16}
              py={2}
            >
              <Text fow="bold" fos={24} color="black">
                #{item.number}
              </Text>
            </View>
            <Text fow="bold" fos={24}>
              {item.assignedLabel}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
