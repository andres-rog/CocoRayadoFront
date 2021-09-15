import React from "react";
import {
  Box,
  Stack,
  Image,
  Text,
  useColorMode
} from "@chakra-ui/react";

function Card(props) {
  const {texto="Crea tu cuenta, dinos que te gusta.", imagenUrl="https://www.pinclipart.com/picdir/big/133-1331433_free-user-avatar-icons-happy-flat-design-png.png" } = props;
  const { colorMode } = useColorMode();

  return (
    <Box
      p={4}
      width="300px"
      height="500px"
      borderRadius="30"
      borderWidth={4}
      borderColor={(colorMode === "light") ? "#333" : "#fff"}
      margin={5}
    >
        <Stack>
            <Image width="260px" src={imagenUrl}/>
            <Box backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"} width="260px" height="180px" borderRadius="10" padding="3px">
                <Text fontSize="3xl" fontWeight="500">{texto}</Text>
            </Box>
        </Stack>
    </Box>
  );
}

export default Card;