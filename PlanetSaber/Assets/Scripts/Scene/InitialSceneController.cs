using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class InitialSceneController : MonoBehaviour {

	[SerializeField]
	GameObject fader = null;
    Fade fade = null;

    public static bool isTwinEye = true;

	// Use this for initialization
	void Start () {
        fade = fader.GetComponent<Fade>();
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetMouseButtonDown (0)) {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            if (Physics.Raycast (ray, out hit)) {
                string name = hit.transform.gameObject.name;
                if (name.Substring(0, 4) == "Twin") {
                    InitialSceneController.isTwinEye = true;
                    Debug.Log("Select twin");
                } else {
                    InitialSceneController.isTwinEye = false;
                    Debug.Log("Select single");
                }
                fade.FadeIn(1.0f, () => {SceneManager.LoadScene ("MainScene");});
            }
        }
	}
}
