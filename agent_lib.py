from flask import Flask, request, render_template, send_file, Response, jsonify
from io import BytesIO
from PIL import Image
import io
import matplotlib.pylab as plt 
import os
import functools
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import contextlib
import base64

# Code from TFHub
hub_handle = 'https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2'
hub_module = hub.load(hub_handle)
output_image_size = 750
style_img_size = (256, 256)

def transfer_style(content_image_url, style_image_url):
    content_img_size = (output_image_size, output_image_size)
    content_image = load_image(content_image_url, content_img_size)

    style_image = load_image(style_image_url, style_img_size)
    style_image = tf.nn.avg_pool(style_image, ksize=[3,3], strides=[1,1], padding='SAME')

    outputs = hub_module(tf.constant(content_image), tf.constant(style_image))
    
    return outputs


@functools.lru_cache(maxsize=None)
def load_image(image_url, image_size=(256, 256), preserve_aspect_ratio=True):
    """Loads and preprocesses images."""
    with contextlib.redirect_stdout(io.StringIO()): # Suppress writing to console
        
        # Cache image file locally.
        image_path = tf.keras.utils.get_file(os.path.basename(image_url)[-128:], image_url)
        # Load and convert to float32 numpy array, add batch dimension, and normalize to range [0, 1].
        img = tf.io.decode_image(
            tf.io.read_file(image_path),
            channels=3, dtype=tf.float32)[tf.newaxis, ...]
        
        # Resize image to image_size.
        img = tf.image.resize(img, image_size, preserve_aspect_ratio=True)

    return img
