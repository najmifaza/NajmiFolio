import { Flex, Spinner } from "@once-ui-system/core";

export default function Loading() {
  return (
    <Flex fillWidth paddingY="128" horizontal="center">
      <Spinner />
    </Flex>
  );
}
