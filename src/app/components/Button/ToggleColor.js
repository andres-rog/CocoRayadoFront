import React from "react";
import {
  IconButton,
  useColorMode
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

function ToggleColor() {
    const { colorMode, toggleColorMode} = useColorMode();

  return (
    <IconButton onClick={toggleColorMode} mt={3} icon= {colorMode === "light" ? <SunIcon /> : <MoonIcon />}
    position="absolute"
    top="1"
    right="10"
    width="50px"
    height="50px"
    color = {colorMode === "light" ? "#fff" : "#333"}
    backgroundColor={colorMode === "light" ? "#333" : "#fff"}
    >
        {colorMode === "light" ? "Dark" : "Light"}
    </IconButton>
  );
}

export default ToggleColor;