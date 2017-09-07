using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TitleController : MonoBehaviour {

    private Material mat;
	private Color color;

    // Use this for initialization
	void Start () {
        Destroy(this.gameObject, 3);
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    private void updateFromValue(float newValue) {
        mat.SetColor("_Color", color);
    }
}
