---
layout: post
title: Cloud | Ascii Art
subtitle: Ascii Art
gh-repo: HeNeos/heneos.github.io
gh-badge: [star, follow]
comments: true
tags: [Cloud, Image Processing]
---

I've been inactive on writing for a long time, many thins happened. I'm also now AWS SysOps certified, it went better than I thought. Anyway, let's start with the topic of this entry.

I've been working for several months on ascii art, just as a quick introduction to it, ascii art is the process to represent images with ascii characters. You may be wondering how is that possible?, if you think about images, you will remember that it's compound of pixels, a lot of them, if instead of pixels we replace them with ascii characters, would it work?... Yes, but no.

It's the basic idea, but we are gonna deep dive more into this, otherwise I had not been doing that for several months.

<div style="text-align: center;">
  <img src="https://raw.githubusercontent.com/HeNeos/heneos.github.io/master/assets/img/cloud/ascii_art/ascii_art_ascii.png" width="750">
</div>

## Basic ascii art

Let's start with the basic idea, and then go further from it. If we replace every pixel with a character, the first question is to which character?, how is possible to map every possible pixel (24 bits) to a character (8 bits)?

Let's think for a moment only for a grayscale image, then instead there are only 256 possible pixels, which is much less than $2^{24}$. Now, how can we assign a character to a pixel value? Well, not all ascii characters covers the screen in the same *intensity*, for example, compare this character `-` with `@`, so it makes sense so to assign the characters that less cover the screen with the lowest values in the grayscale (the darker colors) and the brighter pixels with something like `@`.

We have another problem here, despite there are 256 ascii characters, not all of them are printable. However, this is easy to solve, just define ranges where each printable ascii character should map to a grayscale value, you can decide if make this scale linear or not.

And that's it, now you have a way to put ascii characters instead of pixels, so we are done, right? Not really, it's true that now we replaced every character with a pixel and that should work but, a printed ascii character doesn't have the dimensions of a pixel, it depends about the fontsize but in almost all cases, the aspect ratio for a character is not 1:1, it means if you replace every pixel with a character you will see a deformed image, to solve this, easy way is to first modify aspect ratio of the original image, according to your font size, in most cases doubling the width should be enough as a good approximation.

We have another problem, our output image resolution is too big, why? Well, since we discussed before, a character doesn't have the same size as a pixel and depending of your font size it could be bigger, imagine for example if your font takes 12 pixels as height and 8 and width, if you did the rescale to preserve the original aspect ratio of the image then now your output image will be 144 times bigger than before. To solve this issue, you can just downscale the image, reduce the original size so that the output image despite of being multiplied by 144 is still manageable.

We've now solved how to do the ascii art for grayscale images, but not all images are grayscale, most of them are in color, so what can we do? Easy, convert them to grayscale, or use this formula `0.299 Red + 0.587 Green + 0.114 Blue`.

And that's it, it covers a basic ascii art that you can find around the internet.

<div style="text-align: center;">
  <img src="https://raw.githubusercontent.com/HeNeos/heneos.github.io/master/assets/img/cloud/ascii_art/heneos_ascii.png" width="750">
</div>

## Colored ascii art

At this point, you're able to have ascii art from any image preserving the aspect ratio and the size, but you notice an issue, most of the details are lost because even when ascii characters can show the `luminance` of the original image, they're not able to show the `color`, so how to solve this?

Instead of printing the ascii character on a text based display, you can print it on a canvas or a created image, then you will have an image with tons of ascii characters that represents your original image. This concept will help us later when we wanna do videos.

In a canvas, you can select to which color you want to print your ascii character, since you already know the height and width of your font, you also know how to moves over the canvas.

<div style="text-align: center;">
  <img src="https://raw.githubusercontent.com/HeNeos/heneos.github.io/master/assets/img/cloud/ascii_art/jaden_ascii.png" width="750">
</div>

## Video processing

Now, instead of processing an image, we're going to process a video, this step is fairly simple since this could be summarized as just applying the same idea to all frames and then merge them again.

It's good but take into account two things, a video is commonly compressed to save storage with a lower bitrate. Merging all created images with our ascii art will create a heavy video if you don't apply the appropiate compression.

For all of this stuff related with videos, I recommend to use ffmpeg and create your own small set of functions that call to ffmpeg, you're gonna need it to resize the video, to split/merge frames and to extract/add the audio.

## Dithering

You've probably notices on your videos those ugly color bands. It's just disgusting... it's happening because our character space is not as big as the original pixel one. Hopefully, there are already solutions for that and one of them is applying a noise, which is dithering.

There are many dithering algorithms and you can use whatever you want, I implemented like 5 of them if you wanna try but there are not so noticeable differences, so just use whatever you want.

<div style="text-align: center;">
  <img src="https://raw.githubusercontent.com/HeNeos/heneos.github.io/master/assets/img/cloud/ascii_art/david_ascii.png" width="750">
</div>

## Edge detection

At this point, you already have a nice ascii art generator, but there is a still a thing missing. Edges.

It's nice that our ascii art can capture color and luminance, but it's not telling use about edges, of course originally pixels also didn't show us them but it's because the original image has a higher resolution than the distorted for the ascii processing, so we need to use some of our ascii characters as edges, sadly we don't have many, only: `_/|\`.

Now the question is, how can we detect edges? Well that's an old and popular topic, there are many filters to extract those edges, use difference of gaussians and sobel filter to capture it, with that now you can get the angle of each pixel and then map the angles to our for ascii characters. Replace those characters with the initial ascii art and that's it.

## Further

I've just explained what to do, not how to do, and that's because in the implementation is the joyness of this. Try to do the optimizations for yourself, be aware that despite python could be a good idea because of the libraries for image processing, it's really slow, it could work fast for images but you will suffer in videos.

