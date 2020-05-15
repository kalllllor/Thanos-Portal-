import React, { Component } from "react";
import * as THREE from "three";

class ThreeScene extends Component {
    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        this.scene = new THREE.Scene();

        //Add Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor("0x000000", 1);
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);

        //add Camera
        this.camera = new THREE.PerspectiveCamera(80, width / height, 1, 10000);
        this.camera.position.z = 1000;
        this.scene.add(this.camera)

        //LIGHTS
        var sceneLight = new THREE.DirectionalLight(0xffffff, 0.5)
        sceneLight.position.set(0, 0, 1);
        this.scene.add(sceneLight);

        var portalLight = new THREE.PointLight(0x062d89, 30, 350, 1.7);
        portalLight.position.set(0, 0, 250)
        this.scene.add(portalLight);
        //Simple Box with WireFrame
        this.addModels();
        this.renderScene();
        //start animation
        this.start();
    }

    addModels() {
        // -----Step 1--------
        const geometry = new THREE.PlaneBufferGeometry(350, 350);
        const material = new THREE.MeshBasicMaterial({
            transparent: true
        });
        this.portalParticles = [];
        this.cube = new THREE.Mesh(geometry, material);
        for (let i = 880; i > 250; i--) {
            let particle = new THREE.Mesh(geometry, material);;
            particle.position.set(
                0.5 * i * Math.cos((4 * i * Math.PI) / 180),
                0.5 * i * Math.sin((4 * i * Math.PI) / 180),
                0.1 * i
            );
            particle.rotation.z = Math.random() * 360;
            this.portalParticles.push(particle)
            this.scene.add(particle);
            this.clock = new THREE.Clock();
        }


        // -----Step 2--------
        //LOAD TEXTURE and on completion apply it on SPHERE
        var loader = new THREE.TextureLoader();
        loader.setCrossOrigin('Anonymous');
        loader.load(
            "https://redstapler.co/wp-content/uploads/2019/05/smoke.png",
            texture => {
                //Update Texture
                this.cube.material.map = texture;
                this.cube.material.needsUpdate = true;
            },
            xhr => {
                //Download Progress
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            //xddd
            error => {
                //Error CallBack
                console.log("An error happened" + error);
            }
        );
    }

    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
    }
    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    };
    stop = () => {
        cancelAnimationFrame(this.frameId);
    };
    animate = () => {
        let delta = this.clock.getDelta();
        this.portalParticles.forEach(i => {
            i.rotation.z -= delta * 1.5;
        })
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);
    };
    renderScene = () => {
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    };

    render() {
        return (
            <div
                style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
                ref={mount => {
                    this.mount = mount;
                }}
            />
        );
    }
}
export default ThreeScene;
