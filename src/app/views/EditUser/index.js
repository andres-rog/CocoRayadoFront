import React from "react";
import {Box, Flex, Text, Stack, FormControl, Input, FormLabel, FormErrorMessage, useColorMode, Button, Spinner } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import HamburgerMenu from '../../components/Button/HamburgerMenu';
import ToggleColor from '../../components/Button/ToggleColor';
import {useState, useEffect} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2';

import {proteinasCategorias, frutasVegetalesCategorias, SemillasLegumbresCategorias} from '../../assets/data.json'
import { editUser } from "../../services/apiRoutes";
import { verifyUser } from '../../services/apiRoutes'

const animatedComponents = makeAnimated();

const schema = yup.object().shape({
  username: yup.string().required('Usuario esta vacio').min(3,'Debe de tener entre 3 y 16 caracteres').max(16,'Debe de tener entre 3 y 16 caracteres'),
  proteinas: yup.array().max(5,'No puedes elegir mas de 5 ingredientes.'),
  frutasvegetales: yup.array().max(5,'No puedes elegir mas de 5 ingredientes.'),
  semillaslegumbres: yup.array().max(5,'No puedes elegir mas de 5 ingredientes.')
});

let proteinasFavoritas = [];
let frutasVegetalesFavoritos = [];
let semillasLegumbresFavoritas = [];

export default function EditUser({history}) {
    const [loaded, setLoaded] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [user, setUser] = useState({});
    const {colorMode} = useColorMode();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    function submitStatusCheck(){
        if(proteinasFavoritas.length>5 || frutasVegetalesFavoritos.length>5 || semillasLegumbresFavoritas>5) {
            setDisableSubmit(true);
        }
        else if(disableSubmit) {
            setDisableSubmit(false);
        }
    }

    function pOnChange(e) {
        proteinasFavoritas = e;
        submitStatusCheck();
    }

    function slOnchange(e) {
        frutasVegetalesFavoritos=e;
        submitStatusCheck();
    }

    function fvOnChange(e){
        semillasLegumbresFavoritas=e;
        submitStatusCheck();
    }

    function getProteinas(favoritosArr) {
        let proteinasArr = [];
        proteinasCategorias.map(element=>{
            if(favoritosArr.includes(element.value)) {
                proteinasArr.push({"value":element.value, "label":element.value});
            }
        })
        return proteinasArr;
    }
    function getFrutasVegetales(favoritosArr){
        let frutasVegetalesArr = [];
        frutasVegetalesCategorias.map(element=>{
            if(favoritosArr.includes(element.value)) {
                frutasVegetalesArr.push({"value":element.value, "label":element.value});
            }
        })
        return frutasVegetalesArr;
    }
    function getSemillasLegumbres(favoritosArr){
        let semillasLegumbresArr = [];
        SemillasLegumbresCategorias.map(element=>{
            if(favoritosArr.includes(element.value)) {
                semillasLegumbresArr.push({"value":element.value, "label":element.value});
            }
        })
        return semillasLegumbresArr;
    }

    function sendEdit(editData) {
        editUser(editData)
        .then((user)=>{
            localStorage.setItem("user",JSON.stringify(user.data.result));
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Usuario actualizado!',
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
                title: 'Sucedio un error al actualizar los datos del usuario.',
                showConfirmButton: true,
                timer: 1500
            })
        })
    }

    function onSubmit(values){
        let selectedIngredients=[];
        proteinasFavoritas.map(element => {
            selectedIngredients.push(element.value);
        })
        frutasVegetalesFavoritos.map(element => {
            selectedIngredients.push(element.value);
        })
        semillasLegumbresFavoritas.map(element => {
            selectedIngredients.push(element.value);
        })

        const newData = {
            username:values.username,
            ingredientesFavoritos:selectedIngredients
        }

        if(values.username !== user.username) {
            verifyUser({username:values.username})
            .then(()=>{
                sendEdit(newData)
            })
            .catch((error) =>{
                console.log(error)
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Ya existe una cuenta con este Nombre de Usuario.',
                    showConfirmButton: false,
                    timer: 1500
                })
            });
        }
        else {
            sendEdit(newData)
        }
    }

    async function getInitData(){
        const userData = JSON.parse(localStorage.getItem("user"));
        if(userData === null){
            history.push('/')
        }
        proteinasFavoritas = getProteinas(userData.ingredientesFavoritos);
        frutasVegetalesFavoritos = getFrutasVegetales(userData.ingredientesFavoritos);
        semillasLegumbresFavoritas = getSemillasLegumbres(userData.ingredientesFavoritos);
        setLoaded(true);
        setUser(userData);
    }

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

    function loadedContent(){
        return(
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
                                    defaultValue={user.username}
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
                                        <Select
                                            defaultValue={proteinasFavoritas}
                                            onChange={pOnChange}
                                            components={animatedComponents}
                                            options={proteinasCategorias}
                                            isMulti
                                            placeholder="Selecciona..."
                                        />
                                    </Box>
                                </Stack>
                            </FormControl>
                            <FormControl isInvalid={errors.frutasvegetales} display="flex" alignItems="center" marginTop="30px" marginBottom="20px">
                                <Stack width="100%">
                                <FormLabel minW="210px" fontSize="xl">Frutas y vegetales:</FormLabel>
                                    <Box color="black">
                                        <Select
                                            defaultValue={frutasVegetalesFavoritos}
                                            onChange={fvOnChange}
                                            components={animatedComponents}
                                            options={frutasVegetalesCategorias}
                                            isMulti
                                            placeholder="Selecciona..."
                                        />
                                    </Box>
                                    <FormErrorMessage>{errors.frutasvegetales && errors.frutasvegetales.message}</FormErrorMessage>
                                </Stack>
                            </FormControl>
                            <FormControl isInvalid={errors.semillaslegumbres} display="flex" alignItems="center" marginTop="30px" marginBottom="20px">
                                <Stack width="100%">
                                <FormLabel minW="210px" fontSize="xl">Semillas y legumbres:</FormLabel>
                                    <Box color="black">
                                        <Select
                                            defaultValue={semillasLegumbresFavoritas}
                                            onChange={slOnchange}
                                            components={animatedComponents}
                                            options={SemillasLegumbresCategorias}
                                            isMulti
                                            placeholder="Selecciona..."
                                        />
                                    </Box>
                                    <FormErrorMessage>{errors.semillaslegumbres && errors.semillaslegumbres.message}</FormErrorMessage>
                                </Stack>
                            </FormControl>
                            <Flex
                                marginTop="30px"
                                display="flex"
                                flexDir="column"
                                alignContent="center"
                                alignItems="center"
                            >
                                <Box display="flex" flexDir="column" alignItems="center">
                                    <Text color="red" display={disableSubmit ? "inline" : "none"}>No puedes elegir mas de 5 ingredientes por categoria</Text>
                                    <Button disabled={disableSubmit} type="submit" marginTop="5%" marginBottom="5%" width="200px" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" isLoading={isSubmitting} fontSize="xl">Actualizar Cuenta</Button>
                                </Box>
                            </Flex>
                        </form>
                    </Box>
                </Box>
            </Stack>
        )
    }

    function loading() {
        return(
            <Box>
                <Spinner size="xl" />
            </Box>
        )
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
                    <Text fontSize="6xl" fontWeight="500">Edita tu cuenta</Text>
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
                    {loaded ? loadedContent() : loading()}
                </Box>
            </Flex>
        </Box>
    )
}