using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CubeController : MonoBehaviour {

    //敵弾
    public GameObject bullet;

    // Use this for initialization
    void Start () {
    }
	
    // Update is called once per frame
    void Update () {
        this.transform.Rotate(new Vector3(0, 0, 5));
        this.transform.Translate(0, 0, -0.1f);
        if (this.transform.position.z > 200.0f) {
            Destroy(this.gameObject);
        }
    }

    public void SetGazedAt(bool gazedAt) {
        GetComponent<Renderer>().material.color = gazedAt ? Color.green : Color.red;
    }
}
