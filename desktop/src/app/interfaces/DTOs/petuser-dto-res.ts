import { PetdetailDTORes } from "./petdetail-dto-res";

export interface PetDetailUser extends PetdetailDTORes {
  user: any; // substitua "any" se você tiver o tipo correto
}