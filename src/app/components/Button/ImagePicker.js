import React from "react";
import {
  Image,
  Text,
  Box
} from "@chakra-ui/react";
import {useState} from 'react';
function ImagePicker({size="200px", type="paso2", imagenUrl="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/b5bd34054bc849159d949d50021d8926.png",texto="Esta es una prueba", onClick=()=>{}}) {
    const [selected, setSelect] = useState(false);

    function MouseOver(event) {
        event.target.style.opacity = 1;
    }
    function MouseOut(event){
        event.target.style.opacity = selected ? 1 : 0.8;
    }
    function select(){
        setSelect(!selected);
        onClick({size,imagenUrl,texto,type,selected});
    }

  return (
    <Box
        display="flex"
        flexDir="column"
        alignContent="center"
        alignItems="center"
        margin={7}
    >
        <Text fontSize="2xl" fontWeight={selected ? "700" : "500"}>{texto}</Text>
        <Box
            borderWidth={selected ? 4 : 0}
            borderColor="green"
            borderRadius="10px"
        >
            <Image
                borderRadius="5px"
                src={imagenUrl}
                boxSize={size}
                objectFit="cover"
                onMouseOver={MouseOver} onMouseOut={MouseOut} onClick={select}
                style={{opacity: 0.8}}
            />
        </Box>
    </Box>
  );
}

export default ImagePicker;