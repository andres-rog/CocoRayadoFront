import React from "react";
import {
  Image,
  Badge,
  Box,
  LinkBox,
  LinkOverlay,
  Button,
  Flex
} from "@chakra-ui/react";
import {useState} from 'react';

function RecipePicker({type="search", keyId="test", imageUrl="https://bit.ly/2Z4KKcF", steps=3, ingredients=2, title="Esta es mi receta con un titulo muy largo asdasasdasdas", date="88/88/8888", favorites=10, onClick=()=>{}}) {
    function test(){
        console.log("HOLA")
    }

    function MouseOver() {
        const element = document.getElementById(keyId);
        element.style.opacity = 0.8;
    }
    function MouseOut(){
        const element = document.getElementById(keyId);
        element.style.opacity = 1;
    }

    return (
      <Box width="400px" borderWidth="2px" borderRadius="lg" onClick={test} margin={4}>
        <LinkBox onMouseOver={MouseOver} onMouseOut={MouseOut}>
            <LinkOverlay href="#"><Image id={keyId} src={imageUrl}/></LinkOverlay>
            <Box p="6">
            <Box d="flex" alignItems="baseline">
                <Badge px="2">
                {date}
                </Badge>
                <Box
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="2"
                >
                {steps} pasos &bull; {ingredients} ingredientes
                </Box>
            </Box>
            <Box
                mt="1"
                fontWeight="semibold"
                fontSize="lg"
                lineHeight="tight"
                textAlign="left"
                isTruncated
            >
                {title}
            </Box>
            <Box d="flex" mt="2" alignItems="center">
                <Box as="span" fontSize="md">
                Favoritos: {favorites}
                </Box>
            </Box>
            </Box>
        </LinkBox>
        <Flex
            display={type==="search" ? "none" : "flex"}
            alignContent="center"
            alignItems="center"
            justifyContent="space-around"
            marginBottom="10px"
        >
            <Button width="100px">Eliminar</Button>
            <Button width="100px">Editar</Button>
        </Flex>
      </Box>
    )
}

export default RecipePicker;