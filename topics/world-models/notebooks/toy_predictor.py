"""
Toy representation predictor — mirrors JEPA-style context→target latent prediction.
Requires: numpy, matplotlib (optional).
"""
import numpy as np

rng = np.random.default_rng(0)
n = 200
dim = 8
data = rng.normal(size=(n, dim))

# Context: first half of dims; target: last half
context = data[:, :dim // 2]
target = data[:, dim // 2:]

# Linear predictor (toy)
W = rng.normal(scale=0.1, size=(dim // 2, dim // 2))
pred = context @ W
loss = np.mean((pred - target) ** 2)

print(f"MSE on random init: {loss:.4f}")
print("Train with gradient steps in a notebook for a full demo.")
