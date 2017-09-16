using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VREyeContorller : MonoBehaviour {

	public GameObject bullet;

	public GameObject target;
	// Use this for initialization
	void Start () {
		this.target = null;		
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetMouseButtonDown (0)) {
			GameObject blt1 = Instantiate(bullet, Vector3.zero, Quaternion.identity);
			GameObject blt2 = Instantiate(bullet, Vector3.zero, Quaternion.identity);
			Quaternion rot = Camera.main.transform.rotation;
			blt1.transform.rotation = rot;
			blt2.transform.rotation = rot;
			blt1.transform.Translate(2, 0, 0);
			blt2.transform.Translate(-2, 0, 0);
			if (this.target) {
				blt1.transform.LookAt(this.target.gameObject.transform);
				blt1.transform.LookAt(this.target.gameObject.transform);
			}
		}
	}
}
