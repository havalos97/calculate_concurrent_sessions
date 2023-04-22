# Tech Interview

## How to run the program
1. Clone this repo and `cd` into it.
2. Run `npm install`
3. Execute the program using the command line using the following syntax:
`npx ts-node ./main.ts [Number of Sessions to generate] [Print output Array: 1=Yes 0=No]` \
\
Example:\
`$ npx ts-node ./main.ts 10 1 (generates 10 sessions and prints the output to the console)`\
\
`$ npx ts-node ./main.ts 25000 0 (generates 25000 sessions and DOESN'T print the output to the console)`

#### There is a noticeable increase in performance when generating large numbers of points (>25k in this case), please see the following screenshot:
\
<img width="717" alt="Screenshot 2023-04-21 at 17 02 10" src="https://user-images.githubusercontent.com/46375752/233765506-245b6136-9cd2-421c-b76c-e5680dd98aee.png">