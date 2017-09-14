using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CubeController : MonoBehaviour {
	public GameObject explode;

	// Use this for initialization
	void Start () {
		SetGazedAt(false);
	}
	
	// Update is called once per frame
	void Update () {
	}

	void OnCollisionEnter(Collision collision) {
        Instantiate(
			explode,
			new Vector3(transform.position.x, transform.position.y, transform.position.z),
			Quaternion.identity);
	}

    public void SetGazedAt(bool gazedAt) {
        GetComponent<Renderer>().material.color = gazedAt ? Color.green : Color.red;
    }

    public void OnGazeEnter() {
        SetGazedAt(true);
        Instantiate(
			explode,
			new Vector3(transform.position.x, transform.position.y, transform.position.z),
			Quaternion.identity);
    }

    public void OnGazeExit() {
        SetGazedAt(false);
    }
}
