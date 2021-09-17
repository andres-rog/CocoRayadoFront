import React from "react";
import {Box, Flex, Text, Image, Stack, FormControl, Input, FormLabel, FormErrorMessage, useColorMode, Button, Link } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import HamburgerMenu from '../../components/Button/HamburgerMenu';
import ToggleColor from '../../components/Button/ToggleColor';
import {useState, useEffect} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2';
import {changePassword} from '../../services/apiRoutes'

const schema = yup.object().shape({
  password: yup.string().required('Contraseña esta vacia').max(255),
  newPassword: yup.string().required('Nueva contraseña esta vacia').max(255),
  confirmPassword: yup.string().required('Confirmar contraseña esta vacia').max(255).oneOf([yup.ref('newPassword'),null],'La contraseña no coincide'),
});

export default function ChangePassword({history}) {
    const [loaded, setLoaded] = useState(false);
    const {colorMode} = useColorMode();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if(!loaded) {
            const userData = JSON.parse(localStorage.getItem("user"));
            if(userData === null || userData===undefined){
                history.push('/')
            }
            else {
                getInitData();
            }
        }
    },[]);

    async function getInitData(){
        const userData = JSON.parse(localStorage.getItem("user"));
        if(userData === null){
            history.push('/')
        }
        setLoaded(true);
    }

    function onSubmit(values){
        changePassword({currentPassword:values.password, newPassword:values.newPassword})
        .then((user)=>{
            localStorage.setItem("user",JSON.stringify(user.data.result));
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Contraseña actualizada!',
                showConfirmButton: false,
                timer: 1500
              }).then(()=>{
                history.push('/dashboard');
              })
        })
        .catch(err=>{
            console.log(err);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Sucedio un error al actualizar la contraseña.',
                showConfirmButton: true,
                timer: 1500
            })
        })
    }


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
                    <HamburgerMenu/>
                    <ToggleColor/>
                    <Text fontSize="6xl" fontWeight="500">Editar usuario</Text>
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
                            <Text fontSize="2xl" fontWeight="500" id="paso1">Cambiar contraseña</Text>
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
                                    <FormControl isInvalid={errors.password} marginTop="30px"  marginBottom="20px" width="400px">
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
                                    <FormControl isInvalid={errors.newPassword} marginTop="30px"  marginBottom="20px">
                                        <FormLabel fontSize="xl">Nueva contraseña:</FormLabel>
                                        <Input
                                            color="Black"
                                            type="password"
                                            placeholder="Nueva contraseña"
                                            backgroundColor="white"
                                            name="newPassword"
                                            {...register("newPassword")}
                                        />
                                        <FormErrorMessage fontSize="md">
                                        {errors.newPassword && errors.newPassword.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={errors.confirmPassword} marginTop="30px"  marginBottom="20px">
                                        <FormLabel fontSize="xl">Confirmar nueva contraseña:</FormLabel>
                                        <Input
                                            color="Black"
                                            type="password"
                                            placeholder="Nueva contraseña"
                                            backgroundColor="white"
                                            name="confirmPassword"
                                            {...register("confirmPassword")}
                                        />
                                        <FormErrorMessage fontSize="md">
                                        {errors.confirmPassword && errors.confirmPassword.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <Flex
                                        marginTop="30px"

                                        display="flex"
                                        flexDir="column"
                                        alignContent="center"
                                        alignItems="center"
                                    >
                                        <Button type="submit" marginTop="5%" marginBottom="5%" width="70%" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" isLoading={isSubmitting} fontSize="xl">Cambiar contraseña</Button>
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