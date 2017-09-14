using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VREyeContorller : MonoBehaviour {

	public GameObject bullet;
	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetMouseButtonDown (0)) {
	        Instantiate(
				bullet,
				new Vector3(transform.position.x, transform.position.y+1.0f, transform.position.z),
				Quaternion.identity);
		}
	}
}
