from PIL import Image

from pixelmatch.contrib.PIL import pixelmatch

img_a = Image.open("a.png")
img_b = Image.open("b.png")
img_diff = Image.new("RGBA", img_a.size)

# note how there is no need to specify dimensions
mismatch = pixelmatch(img_a, img_b, img_diff, includeAA=True)

img_diff.save("diff.png")