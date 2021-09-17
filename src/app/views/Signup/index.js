import React from "react";
import {Box, Flex, Text, Image, Stack, FormControl, Input, FormLabel, FormErrorMessage, useColorMode, Button, Link } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import logo from '../../assets/coconut.png';
import ToggleColor from '../../components/Button/ToggleColor';
import StepContainer from '../../components/Container/stepContainer';
import { HashLink as ScrollLink } from 'react-router-hash-link';
import {useState, useEffect} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2';
import {signupEndpoint} from '../../services/apiRoutes'
import {verifyUser} from '../../services/apiRoutes'

import {proteinasData, FrutasVegetalesData, SemillasLegumbresData} from '../../assets/data.json'

const schema = yup.object().shape({
  username: yup.string().required('Usuario esta vacio').min(3,'Debe de tener entre 3 y 16 caracteres').max(16,'Debe de tener entre 3 y 16 caracteres'),
  email: yup.string().email('Debes ingresar un correo valido').max(255).required('Email esta vacio'),
  confirmEmail: yup.string().oneOf([yup.ref('email'),null],'El email no coincide'),
  password: yup.string().required('Contraseña esta vacia').max(255),
  confirmPassword: yup.string().oneOf([yup.ref('password'),null],'La contraseña no coincide'),
});

export default function Signup({history}) {
    const [userData, setUserData] = useState([]);
    const [ingredientsArray1, setIngredientsArray1] = useState([]);
    const [ingredientsArray2, setIngredientsArray2] = useState([]);
    const [ingredientsArray3, setIngredientsArray3] = useState([]);
    const [finished, setFinished] = useState(false);

    const {colorMode} = useColorMode();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    function goToLogin(){
        history.push('/login');
    }

      function onSubmit_paso1(values) {
        const verifyUserPromise = () => verifyUser({username:values.username, email:values.email});
        return verifyUserPromise()
        .then(res=>{
            console.log(res);
            setUserData(values);
            var element = document.getElementById("paso2");
            element.scrollIntoView({ behavior: 'smooth'})
        })
        .catch((error) =>{
            console.log(error)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ya existe una cuenta con este Nombre de usuario o Email',
                showConfirmButton: false,
                timer: 1500
            })
        });
      }

    function ingredientsHandler(e) {
        console.log(e)
        switch (e.type) {
            case "paso2":
                setIngredientsArray1(e.ingredients);
                break;
            case "paso3":
                setIngredientsArray2(e.ingredients);
                break;
            case "paso4":
                setIngredientsArray3(e.ingredients);
                break;
            default:
                break;
        }
    }

    function finish(){
        Swal.fire({
            title: '¿Deseas crear tu cuenta con estas opciones?',
            showDenyButton: true,
            confirmButtonText: `¡Si, guardar!`,
            denyButtonText: `¡Aun no!`,
            showLoaderOnConfirm: true,
            preConfirm: ()=>{
                const signupPromise = () => signupEndpoint({username:userData.username, email:userData.email, password: userData.password, confirmPassword: userData.confirmPassword, ingredientesFavoritos: [...ingredientsArray1, ...ingredientsArray2, ...ingredientsArray3]});

                return signupPromise()
                .then(res=>{
                    localStorage.setItem("user",JSON.stringify(res.data.result));
                })
                .catch(error => {
                    console.log(error);
                    Swal.showValidationMessage(`¡Oh no! Sucedio un error inesperado :c`);
                });
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
        .then((result) => {
            if (result.isConfirmed) {
                Swal.fire('!Tu cuenta ha sido creada exitosamente!', '', 'success')
                .then(()=>{
                    history.push('/dashboard');
                });
            }
        })
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
                    <Text fontSize="6xl" fontWeight="500">Crea tu cuenta</Text>
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
                                <form onSubmit={handleSubmit(onSubmit_paso1)}>
                                    <FormControl isInvalid={errors.username} width="400px" marginBottom="20px">
                                        <FormLabel fontSize="xl">Username:</FormLabel>
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
                                    <FormControl isInvalid={errors.email} width="400px" marginBottom="20px">
                                        <FormLabel fontSize="xl">Email:</FormLabel>
                                        <Input
                                            color="Black"
                                            name="email"
                                            placeholder="Email"
                                            backgroundColor="white"
                                            {...register("email")}
                                        />
                                        <FormErrorMessage fontSize="md">
                                        {errors.email && errors.email.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={errors.confirmEmail} width="400px" marginBottom="20px">
                                        <FormLabel fontSize="xl">Confirmar Email:</FormLabel>
                                        <Input
                                            color="Black"
                                            name="confirmEmail"
                                            placeholder="Vuelve a escribir el email"
                                            backgroundColor="white"
                                            {...register("confirmEmail")}
                                        />
                                        <FormErrorMessage fontSize="md">
                                        {errors.confirmEmail && errors.confirmEmail.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={errors.password} marginBottom="20px">
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
                                    <FormControl isInvalid={errors.confirmPassword} marginBottom="20px">
                                        <FormLabel fontSize="xl">Confirmar contraseña:</FormLabel>
                                        <Input
                                            color="Black"
                                            type="password"
                                            backgroundColor="white"
                                            placeholder="Vuelve a escribir la contraseña"
                                            name="confirmPassword"
                                            {...register("confirmPassword")}
                                        />
                                        <FormErrorMessage fontSize="md">
                                        {errors.confirmPassword && errors.confirmPassword.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <Flex
                                        display="flex"
                                        flexDir="column"
                                        alignContent="center"
                                        alignItems="center"
                                    >
                                        <Button type="submit" marginTop="5%" marginBottom="5%" width="70%" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" isLoading={isSubmitting} fontSize="xl">Verificar usuario</Button>
                                        <Link fontSize="md" href="#" onClick={goToLogin} marginBottom="5%">¿Ya tienes una cuenta?</Link>
                                    </Flex>
                                </form>
                            </Box>
                        </Box>
                        <Box>
                            <StepContainer
                                imagesArray={proteinasData}
                                containerId="paso2"
                                header="Elije hasta 5 proteinas favoritas"
                                maxOptions={5}
                                backDirection="#paso1"
                                continueDirection="#paso3"
                                onClick={ingredientsHandler}
                            />
                        </Box>
                        <Box>
                            <StepContainer
                                imagesArray={FrutasVegetalesData}
                                containerId="paso3"
                                header="Elije hasta 5 frutas y vegetales favoritos"
                                maxOptions={5}
                                backDirection="#paso2"
                                continueDirection="#paso4"
                                onClick={ingredientsHandler}
                            />
                        </Box>
                        <Box>
                            <StepContainer
                                imagesArray={SemillasLegumbresData}
                                containerId="paso4"
                                header="Elije hasta 5 semillas y legumbres favoritos"
                                maxOptions={5}
                                backDirection="#paso3"
                                continueDirection="#"
                                onFinish={finish}
                                onClick={ingredientsHandler}
                            />
                        </Box>
                    </Stack>
                </Box>
            </Flex>
        </Box>
    )
}