"use strict";

let vertex_anneau=`#version 300 es
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;

in vec3 position_in;
in vec3 normal_in;
in vec2 texcoord_in;

out vec3 vertPos;
out vec3 normalInterp;
out vec2 tc;

void main()
{
	vec4 Po4 = viewMatrix * vec4(position_in,1);
	vertPos = vec3(Po4) / Po4.w;
	normalInterp = normalMatrix * normal_in;
	tc = texcoord_in;
	gl_Position = projectionMatrix * Po4;
}`;

// Effet phong Adapté selon https://www.cs.toronto.edu/~jacobson/phong-demo/
// pour obtenir un anneau doré plus brillant
let fragment_anneau=`#version 300 es
precision highp float;
uniform sampler2D TU0;

in vec3 normalInterp;  // Surface normal
in vec3 vertPos;       // Vertex position
in vec2 tc;


const float Ka = 1.0;   // Ambient reflection coefficient
const float Kd = 1.0;   // Diffuse reflection coefficient
const float Ks = 1.0;   // Specular reflection coefficient
const float shininessVal = 8.0; // Shininess
const vec3 ambientColor = vec3(0.2, 0.09, 0.0);
const vec3 specularColor = vec3(1,1,1);
const vec3 lightPos = vec3(0.0,0.5,1.0); // Light position

out vec4 frag_out;

void main()
{
	vec3 col = texture(TU0,tc).rgb;
	
	vec3 N = normalize(normalInterp);
    vec3 L = normalize(lightPos - vertPos);

    // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);

    float specular = 0.0;

    if(lambertian > 0.0) {
        vec3 R = reflect(-L, N);      // Reflected light vector
        vec3 V = normalize(-vertPos); // Vector to viewer

        // Compute the specular term
        float specAngle = max(dot(R, V), 0.0);
        specular = pow(specAngle, shininessVal);
    }
    frag_out = vec4(Ka * ambientColor + Kd * lambertian * col + Ks * specular * specularColor, 1.0);
}`;


let vertex_diamant =`#version 300 es
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

in vec3 position_in;
in vec2 texcoord_in;

out vec2 tc;

void main()
{
	tc = texcoord_in;
	gl_Position = projectionMatrix * viewMatrix * vec4(position_in,1);
}`;

let fragment_diamant=`#version 300 es
precision highp float;
uniform sampler2D TU0;

in vec2 tc;

out vec4 frag_out;

void main()
{
    vec3 col = texture(TU0, tc).rgb;
    frag_out = vec4(col,1.0);
}`;


//Declaration
let mesh_anneau = null;
let prg_anneau = null;

let mesh_diamant = null;
let prg_diamant = null;

let diamant_tex = null;
let gold_tex = null;

function init_wgl(){
    //Mise en place interface
    UserInterface.begin();
    UserInterface.adjust_width();

    // Texture
    gold_tex = Texture2d();
    diamant_tex = Texture2d();
    Promise.all([
        gold_tex.load("texture/pink-gold-texture.jpg", gl.RGB8, gl.RGB),
        diamant_tex.load("texture/diamond-texture.jpg", gl.RGB8, gl.RGB)
    ]).then(update_wgl);

    //
    prg_anneau = ShaderProgram(vertex_anneau,fragment_anneau,'anneau');
    let anneau = Mesh.Ring(50);
    mesh_anneau = anneau.renderer(true,true,true);

    //
    prg_diamant= ShaderProgram(vertex_diamant,fragment_diamant,'diamant');
    let diamant = Mesh.Diamant(7);
    mesh_diamant = diamant.renderer(true,false,true);

    scene_camera.set_scene_radius(anneau.BB.radius);
    scene_camera.set_scene_center(anneau.BB.center);
}

function draw_wgl(){
    gl.clearColor( 0.84314, 0.62353, 0.86667, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const projection_matrix = scene_camera.get_projection_matrix();
    const view_matrix = scene_camera.get_view_matrix();

    prg_anneau.bind();
    prg_anneau.uniform.viewMatrix = mmult(view_matrix, scale(0.5, 0.5, 1.2));
    prg_anneau.uniform.projectionMatrix = projection_matrix;
    prg_anneau.uniform.normalMatrix = view_matrix.inverse3transpose();
    prg_anneau.uniform.TU0 = gold_tex.bind();
    mesh_anneau.draw(gl.TRIANGLES);


    prg_diamant.bind();
    prg_diamant.uniform.viewMatrix = mmult(view_matrix, translate(0.0, 0.176, 0.0), rotateX(90), scale(0.1));
    prg_diamant.uniform.projectionMatrix = projection_matrix;
    prg_diamant.uniform.TU0 = diamant_tex.bind();
    mesh_diamant.draw(gl.TRIANGLES);
}

launch_3d();