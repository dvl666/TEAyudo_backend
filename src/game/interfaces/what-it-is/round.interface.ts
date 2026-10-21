import { PictogramImageSigned } from "src/pictogram/interfaces/pictogram-image-sign.interface";

export interface WhatItIsRound {
    round:              number;
    prompt:             string;
    correctPictogramId: string;
    pictograms:         PictogramImageSigned[];
}