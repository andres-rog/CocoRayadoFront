import React from "react";
import {Box, Flex, Text, Image, Stack, FormControl, Input, FormLabel, FormErrorMessage, useColorMode, Button, Link } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import logo from '../../assets/coconut.png';
import ToggleColor from '../../components/Button/ToggleColor';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2';
import {loginEndpoint} from '../../services/apiRoutes'
import {useEffect} from 'react';

const schema = yup.object().shape({
  username: yup.string().required('Usuario/Email esta vacio').min(3,'Debe de tener entre 3 y 255 caracteres').max(255,'Debe de tener entre 3 y 255 caracteres'),
  password: yup.string().required('Contraseña esta vacia').max(255),
});

export default function Login({history}) {
    const {colorMode} = useColorMode();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    function goToSignup() {
        history.push('/signup');
    }

    function onSubmit(values){
        const loginPromise = () => loginEndpoint({name:values.username,password:values.password});
        return loginPromise()
            .then(res=>{
                localStorage.setItem("user",JSON.stringify(res.data.result));
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '¡Bienvenido!',
                    showConfirmButton: false,
                    timer: 1500
                  }).then(()=>{
                    history.push('/dashboard');
                  })
            })
            .catch(() =>{
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Usuario o contraseña incorrecta',
                    showConfirmButton: false,
                    timer: 1500
                })
            });
    }

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if(userData !== null){
            history.push('/dashboard')
        }
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
                >
                    <ToggleColor/>
                    <Text fontSize="6xl" fontWeight="500">Ingresa a tu cuenta</Text>
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
                            <Text fontSize="2xl" fontWeight="500" id="paso1">Crea tu perfil</Text>
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
                                    <FormControl isInvalid={errors.username} width="400px" marginTop="30px" marginBottom="20px">
                                        <FormLabel fontSize="xl">Usuario o Email:</FormLabel>
                                        <Input
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
                                        <Button type="submit" marginTop="5%" marginBottom="5%" width="70%" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" isLoading={isSubmitting} fontSize="xl">Ingresar</Button>
                                        <Link fontSize="md" href="#" onClick={goToSignup} marginBottom="5%">¿No tienes una cuenta?</Link>
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