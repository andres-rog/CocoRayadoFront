import React from "react";

import {Box, Flex, Text, FormControl, Input, FormLabel, useColorMode, Button, Divider, Accordion,AccordionItem,
        AccordionButton,AccordionPanel,AccordionIcon, FormErrorMessage, NumberInput, NumberDecrementStepper, NumberIncrementStepper,
        NumberInputStepper, NumberInputField, RadioGroup, Radio, HStack, Tooltip} from "@chakra-ui/react";
import { QuestionIcon } from '@chakra-ui/icons';
import { useForm } from "react-hook-form";
import ToggleColor from '../../components/Button/ToggleColor';
import RecipePicker from '../../components/Button/RecipePicker';
import HamburgerMenu from '../../components/Button/HamburgerMenu';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import {useState} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2';

import {categorias, ingredientes} from '../../assets/data.json';

const schema = yup.object().shape({
  title: yup.string(),
  ingredientsQuantity: yup.number().min(0).max(99),
  ingredientsTags: yup.string(),
  tags: yup.string(),
  orderBy: yup.string(),
});

const animatedComponents = makeAnimated();

const exampleData = [
    {title:"Este es mi titulo muy muy muy largo para la receta", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo1", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo2", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo2", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo3", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo4", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo5", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo6", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo7", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo8", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo9", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo10", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo11", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo12", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo13", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo14", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo15", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo16", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo17", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo18", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo19", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo20", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo21", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo22", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo23", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo24", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo25", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo26", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo27", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo28", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo29", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo30", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo31", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo32", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo33", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo34", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo35", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo36", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo37", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo38", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo39", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo40", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
    {title:"Receta ejemplo41", date:"88/88/8888", thumbnail:"https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png"},
];

let selectedCategories=[];
let selectedIngredients=[];
let ingredientsQuantity = "0";
let orderBy = "fecha";

export default function Dashboard({history}) {

    const {colorMode} = useColorMode();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    function onSubmit(values) {
        values["selectedCategories"]=selectedCategories;
        values["selectedIngredients"]=selectedIngredients;
        values["ingredientsQuantity"]=ingredientsQuantity;
        values["orderBy"]=orderBy;
        return new Promise((resolve) => {
            setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                resolve();
            }, 3000);
        });
    }

    function handleCategories(e) {
        selectedCategories=e;
        console.log(selectedCategories)
    }

    function handleIngredients(e) {
        selectedIngredients=e;
    }

    function handleIngredientsAmount(e) {
        ingredientsQuantity=e;
    }

    function handleOrderBy(e) {
        orderBy=e;
    }

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
                <Text fontSize="lg" fontWeight="500" margin={1}>¡Bienvenido Username!</Text>
                <Text fontSize="4xl" fontWeight="500">Explora nuestras recetas</Text>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                alignContent="center"
                alignItems="center"
                justifyContent="center"
            >
                <Divider marginTop={5} marginBottom={3}/>
                <Flex
                    alignContent="center"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Accordion allowToggle={true}
                        width="70vw"
                        borderRadius="3"
                        borderWidth={1}
                        borderColor={(colorMode === "light") ? "#333" : "#fff"}
                        backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)"}
                    >
                        <AccordionItem>
                            <Flex display="flex" alignItems="center" margin={2}>
                                <Box textAlign="left" width="full">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <FormControl isInvalid={errors.title} display="flex" alignItems="center">
                                            <FormLabel minW="180px" fontSize="lg">Nombre de la receta:</FormLabel>
                                            <Input
                                                id="recipe"
                                                backgroundColor="white"
                                                placeholder="Busca tu receta favorita"
                                                color="black"
                                                _placeholder={{ color: 'gray.500' }}
                                                {...register("title")}
                                            />
                                            <FormErrorMessage>
                                                {errors.title && errors.title.message}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </form>
                                </Box>
                                <AccordionButton width="5px" marginRight="5px">
                                    <AccordionIcon />
                                </AccordionButton>
                            </Flex>
                            <AccordionPanel>
                                <Divider marginBottom={2}/>
                                <Flex display="flex" alignItems="center"margin={2} >
                                    <Box textAlign="left" width="full">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <Box display="flex" alignItems="center" >
                                                <FormLabel minW="210px" fontSize="lg">Categorias:</FormLabel>
                                                <Box width="full" color="black">
                                                    <Select
                                                        components={animatedComponents}
                                                        options={categorias}
                                                        isMulti
                                                        name="categorias"
                                                        placeholder="Selecciona..."
                                                        onChange={handleCategories}
                                                    />
                                                </Box>
                                            </Box>
                                            <Box display="flex" alignItems="center" marginTop={3} >
                                                <FormLabel minW="210px" fontSize="lg">Ingredientes:</FormLabel>
                                                <Box width="full" color="black">
                                                    <Select
                                                        components={animatedComponents}
                                                        options={ingredientes}
                                                        isMulti
                                                        name="ingredientes"
                                                        placeholder="Selecciona..."
                                                        onChange={handleIngredients}
                                                    />
                                                </Box>
                                            </Box>
                                            <FormControl isInvalid={errors.ingredientsQuantity} display="flex" alignItems="center" marginTop={3}>
                                                <FormLabel minW="210px" fontSize="lg">Cantidad maxima ingredientes:</FormLabel>
                                                <NumberInput max={99} min={0} id="ingredientsQuantity" backgroundColor="white" color="black" defaultValue="0" onChange={handleIngredientsAmount}>
                                                    <NumberInputField/>
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper color="black"/>
                                                        <NumberDecrementStepper color="black"/>
                                                    </NumberInputStepper>
                                                </NumberInput>
                                                <Tooltip label="Elije 0 para buscar recetas con cualquier cantidad de ingredientes."><QuestionIcon marginLeft="5px" width="30px"/></Tooltip>
                                            </FormControl>
                                            <FormControl isInvalid={errors.orderBy} display="flex" alignItems="center" marginTop={3}>
                                                <FormLabel minW="210px" fontSize="lg">Ordenar por:</FormLabel>
                                                <RadioGroup defaultValue="fecha" id="orderBy" onChange={handleOrderBy}>
                                                    <HStack spacing="24px">
                                                      <Radio value="fecha"><Tooltip label="Recetas mas recientes primero">Fecha</Tooltip></Radio>
                                                      <Radio value="favoritos"><Tooltip label="Recetas con mas populares primero">Popularidad</Tooltip></Radio>
                                                      <Radio value="ingredientesFavoritos"><Tooltip label="Recetas con mas coincidencias con tus ingredientes favoritos primero">Ingredientes favoritos</Tooltip></Radio>
                                                    </HStack>
                                                </RadioGroup>
                                                <FormErrorMessage>
                                                    {errors.tags && errors.tags.message}
                                                    {errors.ingredientsTags && errors.ingredientsTags.message}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </form>
                                    </Box>
                                </Flex>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Button marginLeft="15px" type="submit" width="200px" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" isLoading={isSubmitting}>Buscar</Button>
                    </form>
                </Flex>
                <Divider marginTop={3} marginBottom={5}/>
            </Box>
            <Box
                display="flex"
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                flexWrap="wrap"

                width="90%"
                minH="75vh"

                borderRadius="20"
                borderWidth={2}
                borderColor={(colorMode === "light") ? "#333" : "#fff"}
                backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"}
                margin="0 auto"
            >
                {
                    exampleData.map((element, index)=>(
                        <RecipePicker keyId={index} title={element.title}/>
                    ))
                }
            </Box>
            <Divider marginTop={5}/>

        </Box>
    )
}