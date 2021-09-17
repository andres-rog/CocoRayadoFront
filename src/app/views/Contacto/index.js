import React from "react";
import {Box, Flex, Text, Image, Link, useColorMode} from "@chakra-ui/react";
import logo from '../../assets/coconut.png';
import Card from "../../components/InfoCard/Card";
import ToggleColor from "../../components/Button/ToggleColor";

export default function Contacto({history}) {

    const { colorMode} = useColorMode();

    return (
        <Box bgGradient={(colorMode === "dark") ? "linear(to-tl,#070a0d, #121921, #0f0613)" : "linear(to-tl,#99e5f6 , #28b5d8)"} minWidth="100vw" minHeight="100vh">
            <Flex
                display="flex"
                flexDir="column"
                alignContent="center"
                alignItems="center"
            >
                <Box
                    display="flex"
                    flexDir="column"
                    alignContent="center"
                    alignItems="center"
                    marginTop="20px"
                >
                    <ToggleColor/>
                    <Text fontSize="6xl" fontWeight="500">Hola</Text>
                    <Image src={logo} marginTop="-50px" marginBottom="-20px" width="250px" height="250px"></Image>
                </Box>
                <Box
                    display="flex"
                    flexDir="column"
                    alignContent="center"
                    alignItems="center"

                    fontWeight="600"
                    color="orange.400"
                    width="100%"
                >
                    <Text fontSize="2xl">Me llamo Andres</Text>
                    <Text fontSize="2xl">Mi correo: <Link href="mailto:Andres.ROG@outlook.com">Andres.ROG@outlook.com</Link></Text>
                    <Text fontSize="2xl">Telefono: +52 811-672-5220</Text>
                    <Text fontSize="2xl">Linkedin:  <Link href="https://www.linkedin.com/in/andrés-osuna/">in/andrés-osuna/</Link></Text>
                    <Text fontSize="2xl">Github:  <Link href="https://github.com/andres-rog">github.com/andres-rog</Link></Text>
                </Box>
            </Flex>
        </Box>
    )
}