import React from "react";
import {Box, Flex, Text, Image, Link, useColorMode} from "@chakra-ui/react";
import logo from '../../assets/coconut.png';
import Card from "../../components/InfoCard/Card";
import ToggleColor from "../../components/Button/ToggleColor";
import {useEffect} from 'react';

export default function Home({history}) {

    const { colorMode} = useColorMode();

    function gotoLogin() {
        history.push('/login');
    }

    function gotoSignup() {
        history.push('/signup');
    }

    function gotoContact() {
        history.push('/contacto');
    }

    function getDataInit(){
        const userData = JSON.parse(localStorage.getItem("user"));
        if(userData !== null){
            history.push('/dashboard')
        }
    }

    useEffect(() => {
        getDataInit();
    },[]);

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
                    <Text fontSize="6xl" fontWeight="500">CocoRayado</Text>
                    <Image src={logo} marginTop="-50px" marginBottom="-20px" width="250px" height="250px"></Image>
                </Box>
                <Box
                    display="flex"
                    alignContent="center"
                    alignItems="center"

                    fontWeight="600"
                    color="orange.400"
                >
                    <Link fontSize="4xl" href="#" onClick={gotoLogin} marginRight="70px">Iniciar Sesion</Link>
                    <Link fontSize="4xl" href="#" onClick={gotoSignup} marginRight="70px">Crear Cuenta</Link>
                    <Link fontSize="4xl" href="#" onClick={gotoContact} marginRight="70px">Contacto</Link>
                </Box>
                <Box
                    display="flex"
                    flexDir="column"
                    alignContent="center"
                    alignItems="center"
                >
                    <Flex
                        display="flex"
                        alignContent="center"
                        alignItems="center"
                        marginTop="50px"
                    >
                        <Card
                            texto="Crea tu cuenta, dinos que te gusta."
                            imagenUrl="https://www.pinclipart.com/picdir/big/133-1331433_free-user-avatar-icons-happy-flat-design-png.png"
                        />
                        <Card
                            texto="Busca y guarda tus recetas favoritas."
                            imagenUrl="https://i.imgur.com/IUR8Q1B.png"
                        />
                        <Card
                            texto="Comparte tus recetas con esta gran comunidad."
                            imagenUrl="https://image.flaticon.com/icons/png/512/1094/1094675.png"
                        />
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}