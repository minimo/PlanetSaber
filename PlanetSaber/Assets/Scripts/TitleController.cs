using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TitleController : MonoBehaviour {

    private Material mat;
	private Color color;

    // Use this for initialization
	void Start () {
        Destroy(this.gameObject, 3);        
		color = mat.GetColor("_Color");
		mat = this.GetComponent<Material>();
		iTween.ValueTo(gameObject, iTween.Hash(
            "from", 1.0f,
            "to", 0.0f,
            "onupdatetarget", gameObject,
            "onupdate", "updateFromValue",
            "time", 0.8f,
            "delay", 0.0f,
            "easeType", "easeOutQuad"
        ));
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    private void updateFromValue(float newValue) {
        mat.SetColor("_Color", color);
    }
}
