const blue =    [2, 1, 'blue'];
const white =   [1, 2, 'white'];
const yellow =  [2, 1, 'yellow'];
const black =   [3, 1, 'black'];
const train =   [1, 3, 'train'];

const levels = [
    [
        [1,6,blue],
        [3,6,blue],
        [3,5,blue],
        [5,2,blue],

        [3,1,white],
        [4,2,white],
        [2,4,white],

        [5,4,train],
        [6,4,train],
        [1,1,train],

        [4,1,black],

        [2,3,yellow],    // move this car out
    ],

    [
        [2,2,blue],
        [1,4,blue],
        [3,6,blue],
        [5,6,blue],

        [1,2,white],
        [2,5,white],
        [3,4,white],
        [4,1,white],
        [6,1,white],

        [5,1,train],

        [1,1,black],

        [2,3,yellow],    // move this car out
    ],

    [
        [5,1,blue],
        [5,5,blue],
        [2,6,blue],

        [4,5,white],
        [2,4,white],
        [5,2,white],
        [1,5,white],
        [1,1,white],

        [3,4,black],

        [3,1,train],
        [6,2,train],

        [1,3,yellow],
    ]
]