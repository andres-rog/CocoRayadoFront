import React from "react";
import {Box, Flex, Text, Image, Stack, FormControl, Input, FormLabel, FormErrorMessage, useColorMode, Button, Tooltip } from "@chakra-ui/react";
import { QuestionIcon } from '@chakra-ui/icons';
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import logo from '../../assets/coconut.png';
import ToggleColor from '../../components/Button/ToggleColor';
import {useState} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2';

import {proteinasCategorias, frutasVegetalesCategorias, SemillasLegumbresCategorias} from '../../assets/data.json'

const animatedComponents = makeAnimated();

const schema = yup.object().shape({
  username: yup.string().required('Usuario esta vacio').min(3,'Debe de tener entre 3 y 16 caracteres').max(16,'Debe de tener entre 3 y 16 caracteres'),
  proteinas: yup.array().max(5,'No puedes elegir mas de 5 ingredientes.'),
  frutasvegetales: yup.array().max(5,'No puedes elegir mas de 5 ingredientes.'),
  semillaslegumbres: yup.array().max(5,'No puedes elegir mas de 5 ingredientes.'),
  password: yup.string().required('Contraseña esta vacia').max(255),
});

const userTestData = {
    "username":"testUser",
    "proteinas":["Res","Pollo"],
    "frutasyvegetales":["Manzana"],
    "semillaslegumbres":[],
}

export default function EditUser({history}) {
    const {colorMode} = useColorMode();

    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    function onSubmit(values){
        return new Promise((resolve) => {
            setTimeout(() => {
              alert(JSON.stringify({values}, null, 2));
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Cuenta actualizada!',
                showConfirmButton: false,
                timer: 1500
              }).then(()=>{
                history.push('/dashboard');
              })
              resolve();
            }, 3000);
        })
        .catch(error => {
            console.log(error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Contraseña incorrecta',
                showConfirmButton: false,
                timer: 1500
            })
        });
    }

    return (
        <Box bgGradient={(colorMode === "dark") ? "linear(to-tl,#070a0d, #121921, #0f0613)" : "linear(to-tl,#86FFF5, #C0FFFA, #B8FFF9)"} minWidth="100vw" minHeight="100vh">
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
                >
                    <ToggleColor/>
                    <Text fontSize="6xl" fontWeight="500">Edita tu cuenta</Text>
                    <Image
                        position="absolute"
                        bottom="50px"
                        left="2"
                        src={logo} marginTop="-50px" marginBottom="-20px" width="100px" height="100px">
                    </Image>
                </Box>
                <Box
                    p={4}
                    width="80vw"
                    height="87vh"
                    borderRadius="30"
                    borderWidth={4}
                    borderColor={(colorMode === "light") ? "#333" : "#fff"}
                    margin={5}
                    marginTop={1}
                    overflowY="hidden"
                >
                    <Stack>
                        <Box
                            display="flex"
                            flexDir="column"
                            alignContent="center"
                            alignItems="center"
                        >
                            <Text fontSize="2xl" fontWeight="500" id="paso1">Actualiza tu informacion</Text>
                            <Box
                                display="flex"
                                alignContent="center"
                                p={4}

                                maxWidth="800px"
                                height="70vh"

                                overflowY="auto"

                                borderRadius="30"
                                borderWidth={2}
                                borderColor={(colorMode === "light") ? "#333" : "#fff"}
                                backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}
                                margin={5}
                            >
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <FormControl isInvalid={errors.username} width="700px" marginTop="30px" marginBottom="20px">
                                        <FormLabel fontSize="xl">Nombre de Usuario:</FormLabel>
                                        <Input
                                            value={userTestData.username}
                                            name="username"
                                            backgroundColor="white"
                                            color="black"
                                            placeholder="Username"
                                            {...register("username")}
                                        />
                                        <FormErrorMessage fontSize="md">
                                        {errors.username && errors.username.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={errors.proteinas} display="flex" alignItems="center" marginTop="30px" marginBottom="20px">
                                        <Stack width="100%">
                                        <FormLabel minW="210px" fontSize="xl">Proteinas:</FormLabel>
                                            <Box color="black">
                                                <Controller
                                                    name="proteinas"
                                                    control={control}
                                                    render={({field:{onChange, value, ref}})=><Select
                                                                        defaultValue={[{"value":"Res", "label":"Res"},{"value":"Pollo", "label":"Pollo"}]}
                                                                        inputRef={ref}
                                                                        onChange={val => onChange(val.map(c => c.value))}
                                                                        components={animatedComponents}
                                                                        options={proteinasCategorias}
                                                                        isMulti
                                                                        placeholder="Selecciona..."
                                                                    />}
                                                />
                                            </Box>
                                            <FormErrorMessage>{errors.proteinas && errors.proteinas.message}</FormErrorMessage>
                                        </Stack>
                                    </FormControl>
                                    <FormControl isInvalid={errors.frutasvegetales} display="flex" alignItems="center" marginTop="30px" marginBottom="20px">
                                        <Stack width="100%">
                                        <FormLabel minW="210px" fontSize="xl">Frutas y vegetales:</FormLabel>
                                            <Box color="black">
                                                <Controller
                                                    name="frutasvegetales"
                                                    control={control}
                                                    render={({field:{onChange, value, ref}})=><Select
                                                                        defaultValue={[{"value":"Manzana", "label":"Manzana"}]}
                                                                        inputRef={ref}
                                                                        onChange={val => onChange(val.map(c => c.value))}
                                                                        components={animatedComponents}
                                                                        options={frutasVegetalesCategorias}
                                                                        isMulti
                                                                        placeholder="Selecciona..."
                                                                    />}
                                                />
                                            </Box>
                                            <FormErrorMessage>{errors.frutasvegetales && errors.frutasvegetales.message}</FormErrorMessage>
                                        </Stack>
                                    </FormControl>
                                    <FormControl isInvalid={errors.semillaslegumbres} display="flex" alignItems="center" marginTop="30px" marginBottom="20px">
                                        <Stack width="100%">
                                        <FormLabel minW="210px" fontSize="xl">Semillas y legumbres:</FormLabel>
                                            <Box color="black">
                                                <Controller
                                                    name="semillaslegumbres"
                                                    control={control}
                                                    render={({field:{onChange, value, ref}})=><Select
                                                                        defaultValue={[]}
                                                                        inputRef={ref}
                                                                        onChange={val => onChange(val.map(c => c.value))}
                                                                        components={animatedComponents}
                                                                        options={SemillasLegumbresCategorias}
                                                                        isMulti
                                                                        placeholder="Selecciona..."
                                                                    />}
                                                />
                                            </Box>
                                            <FormErrorMessage>{errors.semillaslegumbres && errors.semillaslegumbres.message}</FormErrorMessage>
                                        </Stack>
                                    </FormControl>
                                    <FormControl isInvalid={errors.password} marginTop="30px"  marginBottom="20px">
                                        <FormLabel fontSize="xl">Contraseña:</FormLabel>
                                        <Input
                                            color="Black"
                                            type="password"
                                            placeholder="Contraseña"
                                            backgroundColor="white"
                                            name="password"
                                            {...register("password")}
                                        />
                                        <FormErrorMessage fontSize="md">
                                        {errors.password && errors.password.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <Flex
                                        marginTop="30px"

                                        display="flex"
                                        flexDir="column"
                                        alignContent="center"
                                        alignItems="center"
                                    >
                                        <Button type="submit" marginTop="5%" marginBottom="5%" width="70%" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" isLoading={isSubmitting} fontSize="xl">Actualizar Cuenta</Button>
                                    </Flex>
                                </form>
                            </Box>
                        </Box>
                    </Stack>
                </Box>
            </Flex>
        </Box>
    )
}