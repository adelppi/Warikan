import { Box, VStack, Text } from "@chakra-ui/react";
import { useWindowSize } from "@uidotdev/usehooks";
import axios from "axios";
import { useState, useEffect } from "react";

const App = () => {
   const { width, height } = useWindowSize();
   const [score, setScore] = useState(0);
   const [positions, setPositions] = useState<{ top: number; left: number }[]>(
      []
   );
   const [time, setTime] = useState<number>(0);
   const [isGameStarted, setGameStarted] = useState(false);
   const [stopWatch, setStopWatch] = useState<any>();
   const numberOfTarget = 1;

   interface rankingItem {
      username: string;
      time: number;
   }
   const [ranking, setRanking] = useState<rankingItem[]>([
      { username: "a", time: 10 },
      { username: "b", time: 12 },
      { username: "c", time: 15 },
   ]);

   // 初期ボックスの配置を設定
   useEffect(() => {
      if (width && height) {
         const newPositions = Array.from({ length: numberOfTarget }, () => ({
            top: Math.floor(Math.random() * (height - 50)) + 25,
            left: Math.floor(Math.random() * (width - 50)) + 25,
         }));
         setPositions(newPositions);
      }
   }, [width, height]);

   useEffect(() => {
      // end
      if (score === numberOfTarget) {
         console.log("end");
         clearInterval(stopWatch);
         setGameStarted(false);

         axios
            .get("")
            .then((response) => setRanking(response.data.body.ranking))
            .catch((error) => console.error(error));
      }
      console.log(score);
   }, [score]);

   const handleClicked = (index: number) => {
      // start
      if (!isGameStarted) {
         const stopWatch = setInterval(() => {
            setTime((prev) => prev + 1);
         }, 10);
         setStopWatch(stopWatch);
         setGameStarted(true);
      }
      setPositions((prev) => prev.filter((_, i) => i !== index));
      setScore((prev) => prev + 1);
   };

   return (
      <VStack
         w="100vw"
         h="100vh"
         bg="teal.100"
         cursor="crosshair"
         fontFamily="courier"
         justifyContent="center"
      >
         <Text fontSize="4xl">
            Score: {score}/{numberOfTarget}
         </Text>
         <Text fontSize="4xl">{(time / 100).toFixed(2)}</Text>
         {!isGameStarted && stopWatch && (
            <VStack w="80%" h="80%" bg="white" p={25}>
               {ranking.map((item: rankingItem) => (
                  <Text>
                     {item.username}: {item.time}
                  </Text>
               ))}
            </VStack>
         )}
         {positions.map((pos, index) => (
            <Box
               position="absolute"
               top={`${pos.top}px`}
               left={`${pos.left}px`}
               boxSize="25px"
               key={index}
               onClick={() => handleClicked(index)}
            >
               <Text fontSize="2xl">🍣</Text>
            </Box>
         ))}
      </VStack>
   );
};

export default App;
