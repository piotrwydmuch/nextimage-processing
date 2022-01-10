package main

import (
	"fmt"
	"syscall/js"
)

var myslice []uint8

func add(this js.Value, args []js.Value) interface{} {

	received := make([]byte, args[0].Get("length").Int())
	_ = js.CopyBytesToGo(received, args[0])
	// fmt.Println(received)
		
	length := len(received)	
	for i := 0; i < length; i+=4 {
		avg := (received[i] + received[i + 1] + received[i + 2]) / 3;
		received[i]     = avg; // red
		received[i + 1] = avg; // green
		received[i + 2] = avg; // blue
	}

	//assign new byte array to global variable
	myslice = received

	// return length of slice
	newData := js.CopyBytesToJS(args[0], received)
	return newData
}


func SetUint8ArrayInGo(this js.Value, args []js.Value) interface{} {
	// fmt.Println(myslice)
	_ = js.CopyBytesToJS(args[0], myslice)
	return nil
}

func registerCallbacks() {
	js.Global().Set("add", js.FuncOf(add))
	js.Global().Set("SetUint8ArrayInGo", js.FuncOf(SetUint8ArrayInGo))
}

func main() {
	//App is ready for user actions
	fmt.Println("App ready.")	
	registerCallbacks()
	c := make(chan int)
	<-c
}

