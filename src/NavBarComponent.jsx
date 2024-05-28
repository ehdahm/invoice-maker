import { Box, Button, Flex, Spacer } from "@chakra-ui/react";

function NavBarComponent({
  title,
  buttonText,
  buttonFunction,
  buttonColor = "blue",
}) {
  return (
    <Flex as="header" width="100%" p="4" bg="gray.100" align="center">
      <Box>
        <h1>{title}</h1>
      </Box>
      <Spacer />
      <Box>
        <Button colorScheme={buttonColor} onClick={buttonFunction}>
          {buttonText}
        </Button>
      </Box>
    </Flex>
  );
}

export default NavBarComponent;
