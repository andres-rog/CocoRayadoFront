import React from "react";

import {Box, Text, useColorMode, Divider, Tabs, TabList, TabPanel, TabPanels, Tab} from "@chakra-ui/react";
import ToggleColor from '../../components/Button/ToggleColor';
import HamburgerMenu from '../../components/Button/HamburgerMenu';
import RecipeBrowser from '../../components/Container/RecipeBrowser';
import FavoritesBrowser from '../../components/Container/FavoritesBrowser';
import CreatedRecipesBrowser from '../../components/Container/CreatedRecipesBrowser';

import {useState, useEffect} from 'react';
import Swal from 'sweetalert2';

export default function Dashboard({history}) {
    const [user, setUser] = useState({});
    const {colorMode} = useColorMode();

    const getData = async()=> {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));

            if(userData === null){
                history.push('/')
            }

            setUser(userData);
        }
        catch(error){
            console.log("ERROR",error);
        }
    }

    useEffect(() => {
        getData();
      },[]);

    return (
        <Box bgGradient={(colorMode === "dark") ? "linear(to-tl,#070a0d, #121921, #0f0613)" : "linear(to-tl,#86FFF5, #C0FFFA, #B8FFF9)"} minWidth="100vw" minHeight="100vh">
            <Box
                display="flex"
                flexDir="column"
                alignContent="center"
                alignItems="center"
                justifyContent="center"
            >
                <ToggleColor/>
                <HamburgerMenu/>
                <Text fontSize="lg" fontWeight="500" margin={2}>¡Bienvenido {user.username}!</Text>
                <Text fontSize="4xl" fontWeight="500">Explora nuestras recetas</Text>
                <Divider paddingTop = {5}/>
            </Box>
            <Tabs marginTop={3} isFitted variant="enclosed">
                <TabList mb="1em">
                    <Tab backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"} fontSize="xl" fontWeight="500">Buscar Recetas</Tab>
                    <Tab backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"} fontSize="xl" fontWeight="500" ml={1} mr={1}>Explora tus favoritos</Tab>
                    <Tab backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"} fontSize="xl" fontWeight="500">Explora tus recetas</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <RecipeBrowser/>
                    </TabPanel>
                    <TabPanel>
                        <FavoritesBrowser/>
                    </TabPanel>
                    <TabPanel>
                        <CreatedRecipesBrowser/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Divider marginTop={5}/>
        </Box>
    )
}