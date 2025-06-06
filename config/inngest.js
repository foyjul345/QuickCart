import { Inngest } from "inngest";
import connecDB from "./db";
import User from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

//inngest function to saave user data to a databae

export const syncUserCreation = inngest.createFunction(
    {
        id:"sync-user-from-clerk"
    },{
        event : "clerk/user.created"
    },
    async({event}) => {
        const {id,first_name,last_name,email_addresses,image_url} = event.data
        const userData = {
            _id:id,
            email:email_addresses[0].email_address,
            name : first_name + " " + last_name,
            imageUrl: image_url
        }
        await connecDB()
        await User.create(userData)
    }
)

//inngest update ton funtion user data in datbase

export const syncUserUpdation = inngest.createFunction(
    {
        id:"update-user-from-clerk"
    },{
        event : "clerk/user.updated"
    },
    async({event}) => {
          const {id,first_name,last_name,email_addresses,image_url} = event.data
        const userData = {
            _id:id,
            email:email_addresses[0].email_address,
            name : first_name + " " + last_name,
            imageUrl: image_url
        }
        await connecDB()
        await User.findByIdAndUpdate(id,userData)
    }
)


// inngest function data from database

export const syncUserDeletion = inngest.createFunction(
    {
        id:"delete-user-from-clerk"
    },{
        event : "clerk/user.deleted"
    },
    async({event}) => {
          const {id} = event.data
       
        await connecDB()
        await User.findByIdAndDelete(id)
    }
)