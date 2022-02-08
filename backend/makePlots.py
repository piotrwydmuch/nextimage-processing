import matplotlib.pyplot as plt
import pandas as pd
import random

doc = pd.read_csv('data.csv')

obj = doc.to_dict().values()

indexArr = [1,2,3,4,5,6,7,8,9,10]
first = (list((list(obj)[0].values())))
second = first.copy()
random.shuffle(second)

print(first)
print(second)

plt.plot(indexArr, first, label='first (const)')
plt.plot(indexArr, second, label='second (real data)')

plt.xlabel('Numer próby')
plt.ylabel('Czas (ms)')

plt.show()
plt.legend()
plt.title("Algorytm wykrywania krawędzi")
plt.savefig('imageProcessing.png')