import { nanoid } from "nanoid";

export const id = () => {
    const adminGeneratedId = `ID-${nanoid(10).toUpperCase()}`
    console.log(adminGeneratedId)
    return  adminGeneratedId
}
