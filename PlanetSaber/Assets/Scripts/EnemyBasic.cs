using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyBasic : MonoBehaviour {
	public GameObject player;
	public VREyeContorller script;
	public GameObject explode;

	// Use this for initialization
	void Start () {
		script = player.GetComponent<VREyeContorller>();
	}
	
	// Update is called once per frame
	void Update () {
	}

	public void inSight(){
		script.target = this.gameObject;
	}

	public void outSight(){
		script.target = null;
	}

	void OnTriggerEnter(Collider other) {
		this.damage();
	}

	public void damage() {
		Destroy(this.gameObject);
        Instantiate(
			explode,
			new Vector3(transform.position.x, transform.position.y, transform.position.z),
			Quaternion.identity);
	}
}
