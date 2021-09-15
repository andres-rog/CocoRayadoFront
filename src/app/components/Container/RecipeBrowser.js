import React from "react";
import {
  Input, Box, useColorMode, Accordion, AccordionItem, FormControl, FormLabel, Text,
  FormErrorMessage, AccordionButton, AccordionIcon, AccordionPanel, Divider, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tooltip, RadioGroup, HStack,
  Radio, Button, Flex, Spinner
} from "@chakra-ui/react";
import { QuestionIcon } from '@chakra-ui/icons';
import { useForm } from "react-hook-form";
import RecipePicker from '../../components/Button/RecipePicker';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import {useState, useEffect} from 'react';
import {browseRecipes} from '../../services/apiRoutes';
import Swal from 'sweetalert2';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import {categorias, ingredientes} from '../../assets/data.json';

const schema = yup.object().shape({
  title: yup.string(),
  ingredientsQuantity: yup.number().min(0).max(99),
  ingredientsTags: yup.string(),
  tags: yup.string(),
  orderBy: yup.string(),
});

const animatedComponents = makeAnimated();

let selectedCategories=[];
let selectedIngredients=[];
let ingredientsQuantity = "0";
let orderBy = "fecha";

function RecipeBrowser({type="search"}) {
    const [loaded, setLoaded] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const {colorMode} = useColorMode();

    useEffect(() => {
        if(!loaded) {
            getInitData();
        }
    },[]);

    async function getInitData(){
        const browseRecipesPromise = () => browseRecipes({title:"", tags:[], ingredients:[]});
        await browseRecipesPromise()
        .then(res=>{
            setRecipes(res.data.result);
            setLoaded(true);
        })
        .catch(err=>{
            console.log(err)
            Swal.fire({
                icon: 'error',
                title: '¡Oh no! sucedió un error al buscar las recetas.',
                text: ':c'
            });
        });
    }

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    async function onSubmit(values) {
        values["selectedCategories"] = [];
        selectedCategories.map((element)=>{
            values.selectedCategories.push(element.value);
        })

        values["selectedIngredients"] = [];
        selectedIngredients.map((element)=>{
            values.selectedIngredients.push(element.value);
        })

        values["ingredientsQuantity"]=ingredientsQuantity;
        values["orderBy"]=orderBy;
        console.log("SELECTED INGREDIENTS",selectedIngredients)
        const searchValues = {
            title: values.title,
            tags: values.selectedCategories,
            ingredients: values.selectedIngredients,
            orderBy: values.orderBy
        }
        if(values.ingredientsQuantity > 0) searchValues["maxIngredients"] = values.ingredientsQuantity;
        const browseRecipePromise = () => browseRecipes(searchValues);

        return browseRecipePromise()
            .then((res)=>{
                setRecipes(res.data.result);
            })
            .catch((err)=>{
                console.log(err);
                Swal.fire({
                    icon: 'error',
                    title: '¡Oh no! sucedió un error al buscar las recetas.',
                    text: ':c'
                });
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

    function showRecipes() {
        return (
            <Box>
                <Box
                    display="flex"
                    flexDir="column"
                    alignContent="center"
                    alignItems="center"
                    justifyContent="center"
                >
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
                            backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}
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
                                                    placeholder="Busca..."
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
                    backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}
                    margin="0 auto"
                >
                    {recipes.length===0 ? <Text fontSize="3xl" fontWeight="500">No se encontraron resultados. :c</Text> : null}
                    {
                        recipes.map((element, index)=>(
                        <RecipePicker keyId={element._id} title={element.title} steps={element.step.length} ingredients={element.ingredientsAmount} favorites={element.favorites} date={element.time.split('T')[0]} imageUrl={element.thumbnail} type={type}/>
                    ))
                }
            </Box>

            </Box>
        )
    }

    function loading(){
        return(
            <Spinner size="xl" />
        )
    }

  return (
    <Box>
        {console.log(recipes)}
        {loaded ? showRecipes() : loading()}
    </Box>
  );
}

export default RecipeBrowser;