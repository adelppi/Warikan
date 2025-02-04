import { Box, VStack, Text, Input, HStack, Button } from "@chakra-ui/react";
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
   const [username, setUsername] = useState(
      localStorage.getItem("username") || null
   );
   const numberOfTarget = 12;

   interface rankingItem {
      username: string;
      userId: number;
      time: number;
   }
   const [ranking, setRanking] = useState<rankingItem[]>([]);

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
      console.log(username);
   }, [username]);

   useEffect(() => {
      // end
      if (score === numberOfTarget) {
         console.log("end");
         clearInterval(stopWatch);
         setGameStarted(false);

         axios
            .get(import.meta.env.VITE_API_URL + "/ranking")
            .then((response) => setRanking(response.data.body.ranking))
            .catch((error) => console.error(error));
      }
      console.log(score);
   }, [score]);

   const handleClicked = (index: number) => {
      // start
      if (!isGameStarted) {
         const stopWatch = setInterval(() => {
            setTime((prev) => prev + 0.01);
         }, 10);
         setStopWatch(stopWatch);
         setGameStarted(true);
      }
      setPositions((prev) => prev.filter((_, i) => i !== index));
      setScore((prev) => prev + 1);
   };

   const handleSendRanking = () => {
      if (!username?.trim()) {
         console.log("名前を入力してください");
         return;
      }

      localStorage.setItem("username", username);
      const postData = {
         username: username,
         userId: localStorage.getItem("userId"),
         time: Math.round(time * 100) / 100,
      };
      console.log("postData", postData);
      axios
         .post(import.meta.env.VITE_API_URL + "/ranking", postData)
         .then((response) => {
            localStorage.setItem("userId", response.data.body.userId);
            setRanking(response.data.body.ranking);
         })
         .catch((error) => console.error(error));
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
         <Text fontSize="4xl">{username}</Text>
         <Text fontSize="4xl">{time.toFixed(2)}</Text>
         {!isGameStarted && stopWatch && (
            <VStack w="80%" h="80%" bg="teal.50" p={25}>
               <HStack>
                  {!localStorage.getItem("username") && (
                     <Input
                        bg="white"
                        value={username || ""}
                        onChange={(e) => setUsername(e.target.value)}
                     />
                  )}
                  <Button onClick={handleSendRanking}>ランキングに登録</Button>
               </HStack>
               {ranking.map((item: rankingItem) => (
                  <Text key={item.username}>
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
