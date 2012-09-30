/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 * Copyright (c) 2012 Branislav Ulicny
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

precision mediump float;

// Uniform values from CSS

uniform float amount;
uniform float tileOutline;

// Built-in uniforms

uniform vec2 u_meshSize;
uniform vec2 u_textureSize;

// Varyings passed in from vertex shader

varying float v_depth;
varying vec2 v_uv;

// Main

void main()
{
	// FIXME: Must swap x and y as a workaround for: 
	// https://bugs.webkit.org/show_bug.cgi?id=96285
	vec2 u_meshSize = u_meshSize.yx;

	vec4 c = vec4(1.0);

	// Fade out.
	c.a = 1.0 - v_depth;

	// Show grid outline.
	if (tileOutline >= 0.5) {
		float cell_width = u_textureSize.x / u_meshSize.y;
		float cell_height = u_textureSize.y / u_meshSize.x;
		float dd = 1.0;

		if (mod(v_uv.x * u_textureSize.x + dd, cell_width) < 2.0
			|| mod(v_uv.y * u_textureSize.y + dd, cell_height) < 2.0) {
			if (amount > 0.0)
				c.rgb = vec3(1.0 - sqrt(amount));
		}
	}
	css_ColorMatrix = mat4(c.r, 0.0, 0.0, 0.0,
							0.0, c.g, 0.0, 0.0,
							0.0, 0.0, c.b, 0.0,
							0.0, 0.0, 0.0, c.a);
}
