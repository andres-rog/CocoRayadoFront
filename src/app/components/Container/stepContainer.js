import React from "react";
import {
  useColorMode,
  IconButton,
  Text,
  Flex,
  Button,
  Box
} from "@chakra-ui/react";
import ImagePicker from '../Button/ImagePicker';
import { HashLink as ScrollLink } from 'react-router-hash-link';
import { TriangleUpIcon } from '@chakra-ui/icons';
import {useState, useEffect} from 'react';

function StepContainer({imageSize="200px", containerId="paso2", imagesArray, header="Esta es una prueba", maxOptions=5, backDirection="#paso1", continueDirection="#paso3", onClick=()=>{}, onFinish=()=>{}, margin_top="11vh", padding_top="1vh"}) {
    const [selectedArray, setSelectedArray] = useState([]);
    const {colorMode} = useColorMode();

    function imageSelect(e) {
        if(e.selected) {
            const newArr1 = selectedArray.filter(function(item) {return item !== e.texto});
            setSelectedArray([...newArr1]);

        }
        else {
            setSelectedArray([e.texto, ...selectedArray]);
        }
    }

    useEffect(() => {
        onClick({type:containerId,ingredients:[...selectedArray]});
    }, [selectedArray]);

  return (
    <Box>
        <Box id={containerId} marginTop={margin_top} paddingTop={padding_top}>
            <ScrollLink  smooth to={backDirection}>
                <IconButton icon={<TriangleUpIcon />} width="30%" height="30px" color={(colorMode === "light") ? "#fff" : "#333"} backgroundColor={(colorMode === "light") ? "#333" : "#fff"}/>
            </ScrollLink>
            </Box>
            <Text fontSize="2xl" fontWeight="500" >{header}</Text>
            <Box
                display="flex"
                flexDir="column"
                justifyContent="space-between"
                width="97%"
                height="77vh"

                borderRadius="30"
                borderWidth={2}
                borderColor={(colorMode === "light") ? "#333" : "#fff"}
                backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}
                margin={5}
                marginTop={1}
                padding={10}
                overflowY="auto"
            >
                <Flex
                display="flex"
                flexWrap="wrap"
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                >
                    {
                        imagesArray.map((element, index)=>(
                            <ImagePicker key={index} texto={element.texto} imagenUrl={element.imagenUrl} onClick={imageSelect} size={imageSize}/>
                        ))
                    }
                </Flex>
                <ScrollLink smooth to={continueDirection}>
                    <Button colorScheme="teal" borderWidth={2} onClick={onFinish} borderColor="rgb(40,100,100)" fontSize="xl" width="50%" height="50px" marginTop="10px" disabled={(selectedArray.length)>5}>
                        Continuar
                    </Button>
                    <Text fontSize="md" color="red">{(selectedArray.length)>maxOptions ? `No puedes elegir mas de ${maxOptions} opciones`:""}</Text>
                </ScrollLink>
            </Box>
    </Box>
  );
}

export default StepContainer;