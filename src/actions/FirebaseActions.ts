import { getDatabase, ref, onValue, set } from "firebase/database";
import { database } from '@/lib/config/firebase';


function addPerson(name: string, age: number){
    //const offsetRef = ref(database, "countdown")
    set(ref(database, 'users/'), {
        Name: "abbe",
        Age: 22

    })
}

function readPeople(){
    const readRef = ref(database, '/users')
    onValue(readRef, (snapshot) => {
        const data = snapshot.val()
        console.log(data)
    })
}

function startTimer(){
    const offsetRef = ref(database, ".info/serverTimeOffset");
    onValue(offsetRef, (snap) => {
        const offset = snap.val();
        const estimatedServerTimeMs = new Date().getTime() + offset;
    });
}