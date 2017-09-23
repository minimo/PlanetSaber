using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MeteoController : MonoBehaviour {

    public float speed;
    Vector3 rot;

	// Use this for initialization
    void Start () {
        this.rot.x = Random.Range(-3.0f, 3.0f); 
        this.rot.y = Random.Range(-3.0f, 3.0f); 
        this.rot.z = Random.Range(-3.0f, 3.0f); 
    }
	
    // Update is called once per frame
    void Update () {
        this.transform.Translate(0, 0, -this.speed, null);
        this.transform.Rotate(this.rot);
    }
}
