'use server'
import {Repeat} from 'src/app/api/repeat/repeat'

export async function start(){
  const repeater = Repeat.getInstance();
  repeater.start();
}

export async function stop(){
  const repeater = Repeat.getInstance();
  repeater.stop();
}

export async function status(){
  const repeater = Repeat.getInstance();
  return{
   
    running:repeater.status,
     lastUpdated:repeater.lastUpdated,
  }
}
