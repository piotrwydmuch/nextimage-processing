package main

import (
	"fmt"
	"sort"
	"syscall/js"
	"time"
)

var myslice []uint8

func grayscaleGo(this js.Value, args []js.Value) interface{} {

	received := make([]byte, args[0].Get("length").Int())
	_ = js.CopyBytesToGo(received, args[0])
	// fmt.Println(received)

	// Measuring execution time 
	start := time.Now()
		
	length := len(received)	
	for i := 0; i < length; i+=4 {
		var avg uint16 = 0;
		avg = (uint16(received[i]) + uint16(received[i + 1]) + uint16(received[i + 2])) / 3;
		received[i]     = byte(avg); // red
		received[i + 1] = byte(avg); // green
		received[i + 2] = byte(avg); // blue
	}

	// print measured time 
	fmt.Println("t: ", time.Since(start))

	//assign new byte array to global variable
	myslice = received

	// return length of slice
	newData := js.CopyBytesToJS(args[0], received)
	return newData
}

// Applies median filtering to an image represented as a one-dimensional array of pixels
func medianFilterGo(this js.Value, args []js.Value) interface{} {

	receivedPixels := make([]byte, args[0].Get("length").Int())
	receivedWidth := args[1].Int();
	receivedHeight := args[2].Int();
	receivedkernelSize := args[3].Int();
	_ = js.CopyBytesToGo(receivedPixels, args[0])

	// Create a new slice to hold the filtered pixels
	filteredPixels := make([]byte, receivedWidth*receivedHeight*4)

	// Iterate over each pixel in the image
	for i := 0; i < len(receivedPixels); i += 4 {
		x := (i / 4) % receivedWidth
		y := (i / 4) / receivedWidth

		// Create a slice to hold the pixel values in the kernel for each color channel
		values := make([][]int, 3)
		for c := range values {
			values[c] = make([]int, 0, (receivedkernelSize*2+1)*(receivedkernelSize*2+1))
		}

		// Iterate over each pixel in the kernel
		for ky := -receivedkernelSize; ky <= receivedkernelSize; ky++ {
			for kx := -receivedkernelSize; kx <= receivedkernelSize; kx++ {
				// Get the pixel value at this position for each color channel
				px := x + kx
				py := y + ky
				index := (py*receivedWidth + px) * 4
				if px >= 0 && px < receivedWidth && py >= 0 && py < receivedHeight {
					values[0] = append(values[0], int(receivedPixels[index]))
					values[1] = append(values[1], int(receivedPixels[index+1]))
					values[2] = append(values[2], int(receivedPixels[index+2]))
				}
			}
		}

		// Compute the median value for each color channel
		medianValues := []int{
			computeMedian(values[0]),
			computeMedian(values[1]),
			computeMedian(values[2]),
		}

		// Set the pixel value in the filtered image for each color channel
		index := i / 4 * 4
		filteredPixels[index] = byte(medianValues[0])
		filteredPixels[index+1] = byte(medianValues[1])
		filteredPixels[index+2] = byte(medianValues[2])
		filteredPixels[index+3] = 255 // Alpha channel is always 255
	}

	// Copy the filtered pixels back to the original pixel array
	copy(receivedPixels, filteredPixels)


	//assign new byte array to global variable
	myslice = receivedPixels

	// return length of slice
	newData := js.CopyBytesToJS(args[0], receivedPixels)
	return newData
}

func computeMedian(values []int) int {
	sort.Ints(values)
	medianIndex := len(values) / 2
	return values[medianIndex]
}

func SetUint8ArrayInGo(this js.Value, args []js.Value) interface{} {
	// fmt.Println(myslice)
	_ = js.CopyBytesToJS(args[0], myslice)
	return nil
}

func registerCallbacks() {
	js.Global().Set("grayscaleGo", js.FuncOf(grayscaleGo))
	js.Global().Set("medianFilterGo", js.FuncOf(medianFilterGo))
	js.Global().Set("SetUint8ArrayInGo", js.FuncOf(SetUint8ArrayInGo))
}

func main() {
	//App is ready for user actions
	// fmt.Println("App ready.")	
	registerCallbacks()
	c := make(chan int)
	<-c
}

