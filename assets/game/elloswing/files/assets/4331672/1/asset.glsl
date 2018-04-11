attribute vec3 position;
attribute vec3 normal;


uniform mat4 matrix_model;
uniform mat4 matrix_view;
uniform mat4 matrix_viewProjection;
uniform mat4 matrix_projection;
uniform float Outline;
uniform float zoffset;
uniform float yoffset;
// vert shader
// if edge is set expand model by small amount
void main(void) {
    vec3 pos0 = position;

    vec4 pos = matrix_viewProjection * matrix_model * vec4(pos0, 1.0);
    mat4 mv = matrix_view * matrix_model;
    mat3 matrix_it_mv;
    matrix_it_mv[0][0] = mv[0][0];
    matrix_it_mv[0][1] = mv[1][0];
    matrix_it_mv[0][2] = mv[2][0];
    matrix_it_mv[1][0] = mv[0][1];
    matrix_it_mv[1][1] = mv[1][1];    
    matrix_it_mv[1][2] = mv[2][1];
    matrix_it_mv[2][0] = mv[0][2];
    matrix_it_mv[2][1] = mv[1][2];
    matrix_it_mv[2][2] = mv[2][2];
    
    vec3 norm = matrix_it_mv * normal;
    
    mat2 p;
    p[0][0] = matrix_projection[0][0];
    p[0][1] = matrix_projection[0][1];
    p[1][0] = matrix_projection[1][0];
    p[1][1] = matrix_projection[1][1];
    
    
    vec2 offset =  p* vec2(normal.x,normal.y);
    pos.xy += offset * Outline;
    pos.y -= yoffset;
    pos.z -= zoffset;
    gl_Position = pos;
}
